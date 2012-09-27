/**
 * PowerTip Utility Functions
 *
 * @fileoverview  Private helper functions.
 * @link          http://stevenbenner.github.com/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @requires      jQuery 1.7+
 */

/**
 * Determine whether a jQuery object is an SVG element
 * @private
 * @param {jQuery} element The element to check
 * @return {boolean} Whether this is an SVG element
 */
function isSvgElement(element) {
	return typeof window.SVGElement !== 'undefined' && element[0] instanceof window.SVGElement;
}

/**
 * Compute the width and height of an HTML or SVG element.
 * @private
 * @param {jQuery} element The element to measure
 * @return {Object} An object with width and height values
 */
function computeElementSize(element) {
	var rect = element[0].getBoundingClientRect();
	return {
		width: rect.width,
		height: rect.height
	};
}

/**
 * Hooks mouse position tracking to mousemove and scroll events.
 * Prevents attaching the events more than once.
 * @private
 */
function initMouseTracking() {
	var lastScrollX = 0,
		lastScrollY = 0;

	if (!session.mouseTrackingActive) {
		session.mouseTrackingActive = true;

		// grab the current scroll position on load
		$(function getScrollPos() {
			lastScrollX = $document.scrollLeft();
			lastScrollY = $document.scrollTop();
		});

		// hook mouse position tracking
		$document.on({
			mousemove: trackMouse,
			scroll: function trackScroll() {
				var x = $document.scrollLeft(),
					y = $document.scrollTop();
				if (x !== lastScrollX) {
					session.currentX += x - lastScrollX;
					lastScrollX = x;
				}
				if (y !== lastScrollY) {
					session.currentY += y - lastScrollY;
					lastScrollY = y;
				}
			}
		});
	}
}

/**
 * Saves the current mouse coordinates to the session object.
 * @private
 * @param {jQuery.Event} event The mousemove event for the document.
 */
function trackMouse(event) {
	session.currentX = event.pageX;
	session.currentY = event.pageY;
}

/**
 * Tests if the mouse is currently over the specified element.
 * @private
 * @param {jQuery} element The element to check for hover.
 * @return {boolean}
 */
function isMouseOver(element) {
	var elementPosition = element.offset(),
		elementSize = computeElementSize(element);
	return session.currentX >= elementPosition.left &&
		session.currentX <= elementPosition.left + elementSize.width &&
		session.currentY >= elementPosition.top &&
		session.currentY <= elementPosition.top + elementSize.height;
}

/**
 * Finds any viewport collisions that an element (the tooltip) would have
 * if it were absolutely positioned at the specified coordinates.
 * @private
 * @param {CSSCordinate} coords Coordinates for the element.
 * @param {number} elementWidth Width of the element in pixels.
 * @param {number} elementHeight Height of the element in pixels.
 * @return {Array.<string>} Array of words representing directional collisions.
 */
function getViewportCollisions(coords, elementWidth, elementHeight) {
	var scrollLeft = $window.scrollLeft(),
		scrollTop = $window.scrollTop(),
		windowWidth = $window.width(),
		windowHeight = $window.height(),
		collisions = [];

	if (coords.top < scrollTop) {
		collisions.push('top');
	}
	if (coords.top + elementHeight > scrollTop + windowHeight) {
		collisions.push('bottom');
	}
	if (coords.left < scrollLeft || coords.right + elementWidth > scrollLeft + windowWidth) {
		collisions.push('left');
	}
	if (coords.left + elementWidth > scrollLeft + windowWidth || coords.right < scrollLeft) {
		collisions.push('right');
	}

	return collisions;
}
