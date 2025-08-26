/**
 * PowerTip Utility Functions
 *
 * @fileoverview  Private helper functions.
 * @link          https://stevenbenner.github.io/jquery-powertip/
 * @author        Steven Benner (https://stevenbenner.com/)
 * @requires      jQuery 1.7+
 */

/**
 * Determine whether a jQuery object is an SVG element
 * @private
 * @param {jQuery} element The element to check
 * @return {boolean} Whether this is an SVG element
 */
function isSvgElement(element) {
	return Boolean(window.SVGElement && element[0] instanceof SVGElement);
}

/**
 * Determines if the specified jQuery.Event object has mouse data.
 * @private
 * @param {jQuery.Event=} event The jQuery.Event object to test.
 * @return {boolean} True if there is mouse data, otherwise false.
 */
function isMouseEvent(event) {
	return Boolean(event && $.inArray(event.type, MOUSE_EVENTS) > -1 &&
		typeof event.pageX === 'number');
}

/**
 * Initializes the viewport dimension cache and hooks up the mouse position
 * tracking and viewport dimension tracking events.
 * Prevents attaching the events more than once.
 * @private
 */
function initTracking() {
	if (!session.mouseTrackingActive) {
		session.mouseTrackingActive = true;

		// grab the current viewport dimensions on load
		getViewportDimensions();
		$(getViewportDimensions);

		// hook mouse move tracking
		$document.on('mousemove' + EVENT_NAMESPACE, trackMouse);

		// hook viewport dimensions tracking
		$window.on('resize' + EVENT_NAMESPACE, trackResize);
		$window.on('scroll' + EVENT_NAMESPACE, trackScroll);
	}
}

/**
 * Updates the viewport dimensions cache.
 * @private
 */
function getViewportDimensions() {
	session.scrollLeft = $window.scrollLeft();
	session.scrollTop = $window.scrollTop();
	session.windowWidth = $window.width();
	session.windowHeight = $window.height();
	session.positionCompensation = computePositionCompensation(session.windowWidth, session.windowHeight);
}

/**
 * Updates the window size info in the viewport dimensions cache.
 * @private
 */
function trackResize() {
	session.windowWidth = $window.width();
	session.windowHeight = $window.height();
	session.positionCompensation = computePositionCompensation(session.windowWidth, session.windowHeight);
}

/**
 * Updates the scroll offset info in the viewport dimensions cache.
 * @private
 */
function trackScroll() {
	var x = $window.scrollLeft(),
		y = $window.scrollTop();
	if (x !== session.scrollLeft) {
		session.currentX += x - session.scrollLeft;
		session.scrollLeft = x;
	}
	if (y !== session.scrollTop) {
		session.currentY += y - session.scrollTop;
		session.scrollTop = y;
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
 * @return {boolean} True if the mouse is over the element, otherwise false.
 */
function isMouseOver(element) {
	// use getBoundingClientRect() because jQuery's width() and height()
	// methods do not work with SVG elements
	// compute width/height because those properties do not exist on the object
	// returned by getBoundingClientRect() in older versions of IE
	var elementPosition = element.offset(),
		elementBox = element[0].getBoundingClientRect(),
		elementWidth = elementBox.right - elementBox.left,
		elementHeight = elementBox.bottom - elementBox.top;

	return session.currentX >= elementPosition.left &&
		session.currentX <= elementPosition.left + elementWidth &&
		session.currentY >= elementPosition.top &&
		session.currentY <= elementPosition.top + elementHeight;
}

/**
 * Fetches the tooltip content from the specified element's data attributes.
 * @private
 * @param {jQuery} element The element to get the tooltip content for.
 * @return {(string|jQuery|undefined)} The text/HTML string, jQuery object, or
 *     undefined if there was no tooltip content for the element.
 */
function getTooltipContent(element) {
	var tipText = element.data(DATA_POWERTIP),
		tipObject = element.data(DATA_POWERTIPJQ),
		tipTarget = element.data(DATA_POWERTIPTARGET),
		targetElement,
		content;

	if (tipText) {
		if (typeof tipText === 'function') {
			tipText = tipText.call(element[0]);
		}
		content = tipText;
	} else if (tipObject) {
		if (typeof tipObject === 'function') {
			tipObject = tipObject.call(element[0]);
		}
		if (tipObject.length > 0) {
			content = tipObject.clone(true, true);
		}
	} else if (tipTarget) {
		targetElement = $('#' + tipTarget);
		if (targetElement.length > 0) {
			content = targetElement.html();
		}
	}

	return content;
}

/**
 * Finds any viewport collisions that an element (the tooltip) would have if it
 * were absolutely positioned at the specified coordinates.
 * @private
 * @param {CSSCoordinates} coords Coordinates for the element.
 * @param {number} elementWidth Width of the element in pixels.
 * @param {number} elementHeight Height of the element in pixels.
 * @return {number} Value with the collision flags.
 */
function getViewportCollisions(coords, elementWidth, elementHeight) {
	// adjusting viewport even though it might be negative because coords
	// comparing with are relative to compensated position
	var viewportTop = session.scrollTop,
		viewportLeft = session.scrollLeft,
		viewportBottom = viewportTop + session.windowHeight,
		viewportRight = viewportLeft + session.windowWidth,
		coordsFromViewport = coords.fromViewportHome(),
		collisions = Collision.none;

	if (coordsFromViewport.top < viewportTop || coordsFromViewport.bottom - elementHeight < viewportTop) {
		collisions |= Collision.top;
	}
	if (coordsFromViewport.top + elementHeight > viewportBottom || coordsFromViewport.bottom > viewportBottom) {
		collisions |= Collision.bottom;
	}
	if (coordsFromViewport.left < viewportLeft || coordsFromViewport.right - elementWidth < viewportLeft) {
		collisions |= Collision.left;
	}
	if (coordsFromViewport.left + elementWidth > viewportRight || coordsFromViewport.right > viewportRight) {
		collisions |= Collision.right;
	}

	return collisions;
}

/**
 * Counts the number of bits set on a flags value.
 * @param {number} value The flags value.
 * @return {number} The number of bits that have been set.
 */
function countFlags(value) {
	var count = 0;
	while (value) {
		value &= value - 1;
		count++;
	}
	return count;
}

/**
 * Check whether element has CSS position attribute other than static
 * @private
 * @param {jQuery} element Element to check
 * @return {boolean} indicating whether position attribute is non-static.
 */
function isPositionNotStatic(element) {
	return element.css('position') !== 'static';
}

/**
 * Get element offsets
 * @private
 * @param {jQuery} el Element to check
 * @return {Object} The top, left, right, bottom offset in pixels
 */
function getElementOffsets(el) {
	// jquery offset returns top and left relative to document in pixels.
	var offsets = el.offset(),
		borderLeftWidth = parseFloat(el.css('border-left-width')),
		borderTopWidth = parseFloat(el.css('border-top-width')),
		right,
		bottom;

	// right and bottom offset were relative to where screen.width,
	// screen.height fell in document.  Change reference point to inner-bottom,
	// inner-right of element.  Compensate for border which is outside
	// measurement area. Avoid updating any measurement set to 'auto' which will
	// result in a computed result of NaN.
	right = session.windowWidth - el.innerWidth() - offsets.left - borderLeftWidth;
	bottom = session.windowHeight - el.innerHeight() - offsets.top - borderTopWidth;
	offsets.top = offsets.top + borderTopWidth;
	offsets.left = offsets.left + borderLeftWidth;
	offsets.right = right ? right : 0;
	offsets.bottom = bottom ? bottom : 0;
	return offsets;
}

/**
 * Compute compensating position offsets if body or html element has non-static position attribute.
 * @private
 * @param {number} windowWidth Window width in pixels.
 * @param {number} windowHeight Window height in pixels.
 * @return {Object} The top, left, right, bottom offset in pixels
 */
function computePositionCompensation(windowWidth, windowHeight) {
	// Check if the element is "positioned". A "positioned" element has a CSS
	// position value other than static. Whether the element is positioned is
	// relevant because absolutely positioned elements are positioned relative
	// to the first positioned ancestor rather than relative to the doc origin.

	var offsets;

	if (isPositionNotStatic($body)) {
		offsets = getElementOffsets($body, windowWidth, windowHeight);
	} else if (isPositionNotStatic($html)) {
		offsets = getElementOffsets($html, windowWidth, windowHeight);
	} else {
		// even though body may have offset, no compensation is required
		offsets = { top: 0, bottom: 0, left: 0, right: 0 };
	}

	return offsets;
}
