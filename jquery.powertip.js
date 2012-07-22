/**
 * jQuery PowerTip Plugin
 *
 * @fileoverview jQuery plugin that creates hover tooltips.
 * @link https://github.com/stevenbenner/jquery-powertip
 * @author Steven Benner
 * @version 1.0.1
 * @requires jQuery 1.7 or later
 * @license jQuery PowerTip Plugin
 * <https://github.com/stevenbenner/jquery-powertip>
 * Copyright (c) 2012 Steven Benner, http://stevenbenner.com/
 * Released under the MIT license.
 * <https://raw.github.com/stevenbenner/jquery-powertip/master/LICENSE.txt>
 */

(function($) {
	'use strict';

	// useful private variables
	var $window = $(window),
		$body = $('body');

	/**
	 * Session data
	 * Private properties global to all powerTip instances
	 * @type Object
	 */
	var session = {
		isPopOpen: false,
		isFixedPopOpen: false,
		popOpenImminent: false,
		activeHover: null,
		mouseTarget: null,
		currentX: 0,
		currentY: 0,
		previousX: 0,
		previousY: 0,
		desyncTimeout: null
	};

	/**
	 * Display hover tooltips on the matched elements.
	 * @param {Object} opts The options object to use for the plugin.
	 * @return {Object} jQuery object for the matched selectors.
	 */
	$.fn.powerTip = function(opts) {

		// don't do any work if there were no matched elements
		if (!this.length) {
			return this;
		}

		// extend options
		var options = $.extend({}, $.fn.powerTip.defaults, opts);

		// hook mouse tracking, once
		hookOnMoveOnce();

		// build and append popup div if it does not already exist
		var tipElement = $('#' + options.popupId);
		if (tipElement.length === 0) {
			tipElement = $('<div></div>', { id: options.popupId });
			$body.append(tipElement);
		}

		// hook mousemove for cursor follow tooltips
		if (options.followMouse) {
			// only one movePop hook per popup element, please
			if (!tipElement.data('hasMouseMove')) {
				$window.on('mousemove', movePop);
			}
			tipElement.data('hasMouseMove', true);
		}

		// attempt to use title attribute text if there is no data-powertip,
		// data-powertipjq or data-powertiptarget. If we do use the title
		// attribute, delete the attribute so the browser will not show it
		this.each(function() {
			var $this = $(this),
				dataPowertip = $this.data('powertip'),
				dataElem = $this.data('powertipjq'),
				dataTarget = $this.data('powertiptarget'),
				title = $this.attr('title');

			if (!dataPowertip && !dataTarget && !dataElem && title) {
				$this.data('powertip', title);
				$this.removeAttr('title');
			}
		});

		// if we want to be able to mouse onto the popup then we need to attach
		// hover events to the popup that will cancel a close request on hover
		// and start a new close request on mouseleave
		if (options.followMouse || options.mouseOnToPopup) {
			tipElement.on({
				mouseenter: function() {
					if (tipElement.data('followMouse') || tipElement.data('mouseOnToPopup')) {
						cancelHoverTimer(session.activeHover);
						session.mouseTarget = session.activeHover;
					}
				},
				mouseleave: function() {
					if (tipElement.data('mouseOnToPopup')) {
						cancelHoverTimer(session.activeHover);
						setHoverTimer(session.activeHover, 'hide');
						session.mouseTarget = null;
					}
				}
			});
		}

		// attach hover events to all matched elements
		return this.on({
			mouseenter: function(event) {
				var element = $(this);
				cancelHoverTimer(element);
				session.mouseTarget = element;
				session.previousX = event.pageX;
				session.previousY = event.pageY;
				if (!element.data('hasActiveHover')) {
					session.popOpenImminent = true;
					setHoverTimer(element, 'show');
				}
			},
			mouseleave: function() {
				var element = $(this);
				cancelHoverTimer(element);
				session.mouseTarget = null;
				session.popOpenImminent = false;
				if (element.data('hasActiveHover')) {
					setHoverTimer(element, 'hide');
				}
			}
		});

		///////////// PRIVATE FUNCTIONS /////////////

		/**
		 * Checks mouse position to make sure
		 * @private
		 * @param {Object} element The element that the popup should target.
		 */
		function checkForIntent(element) {
			cancelHoverTimer(element);

			// calculate mouse position difference
			var xDifference = Math.abs(session.previousX - session.currentX),
				yDifference = Math.abs(session.previousY - session.currentY),
				totalDifference = xDifference + yDifference;

			// check if difference has passed the sensitivity threshold
			if (totalDifference < options.intentSensitivity) {
				element.data('hasActiveHover', true);
				// show popup, asap
				tipElement.queue(function() {
					showTip(element);
				});
			} else {
				// try again
				session.previousX = session.currentX;
				session.previousY = session.currentY;
				setHoverTimer(element, 'show');
			}
		}

		/**
		 * Shows the tooltip popup, as soon as possible.
		 * @private
		 * @param {Object} element The element that the popup should target.
		 */
		function showTip(element) {
			// if the popup is open and we got asked to open another one then
			// the old one is still in its fadeOut cycle, so wait and try again
			if (session.isPopOpen) {
				tipElement.queue(function() {
					showTip(element);
				});
				return;
			}

			var tipText = element.data('powertip'),
				tipTarget = element.data('powertiptarget'),
				tipElem = element.data('powertipjq'),
				tipContent = tipTarget ? $('#' + tipTarget) : [];

			// set popup content
			if (tipText) {
				tipElement.html(tipText);
			} else if (tipElem.length > 0) {
				tipElement.empty();
				tipElem.clone(true, true).appendTo(tipElement);
			} else if (tipContent.length > 0) {
				tipElement.html($('#' + tipTarget).html());
			} else {
				// we have no content to display, give up
				return;
			}

			session.activeHover = element;
			session.isPopOpen = true;

			// set popup position
			if (!options.followMouse) {
				setPopPosition(element);
				session.isFixedPopOpen = true;
			}

			tipElement.data('followMouse', options.followMouse);
			tipElement.data('mouseOnToPopup', options.mouseOnToPopup);

			// fadein
			tipElement.stop(true, true).fadeIn(options.fadeInTime, function() {
				// start desync polling
				if (!session.desyncTimeout) {
					session.desyncTimeout = setInterval(closeDesyncedTip, 500);
				}
			});
		}

		/**
		 * Hides the tooltip popup, immediately.
		 * @private
		 * @param {Object} element The element that the popup should target.
		 */
		function hideTip(element) {
			element.data('hasActiveHover', false);
			tipElement.stop(true, true).fadeOut(options.fadeOutTime, function() {
				session.activeHover = null;
				session.isPopOpen = false;
				session.isFixedPopOpen = false;
				tipElement.removeClass();
				// support mouse-follow and fixed position pops at the same
				// time by moving the popup to the last known cursor location
				// after it is hidden
				tipElement.css('left', session.currentX + options.offset + 'px');
				tipElement.css('top', session.currentY + options.offset + 'px');
				// stop desync polling
				session.desyncTimeout = clearInterval(session.desyncTimeout);
			});
		}

		/**
		 * Checks for a tooltip desync and closes the tooltip if one occurs.
		 * @private
		 */
		function closeDesyncedTip() {
			// It is possible for the mouse cursor to leave an element without
			// firing the mouseleave event. This seems to happen (in FF) if the
			// element is disabled under mouse cursor, the element is moved out
			// from under the mouse cursor (such as a slideDown() occurring
			// above it), or if the browser is resized by code moving the
			// element from under the mouse cursor. If this happens it will
			// result in a desynced tooltip because we wait for any exiting
			// open tooltips to close before opening a new one. So we should
			// periodically check for a desync situation and close the tip if
			// such a situation arises.
			if (session.isPopOpen) {
				var isDesynced = false;

				// case 1: user already moused onto another tip - easy test
				if (session.activeHover.data('hasActiveHover') === false) {
					isDesynced = true;
				} else {
					// case 2: hanging tip - have to test if mouse position is
					// not over the active hover and not over a tooltip set to
					// let the user interact with it
					if (!isMouseOver(session.activeHover)) {
						if (tipElement.data('mouseOnToPopup')) {
							if (!isMouseOver(tipElement)) {
								isDesynced = true;
							}
						} else {
							isDesynced = true;
						}
					}
				}

				if (isDesynced) {
					// close the desynced tip
					hideTip(session.activeHover);
				}
			}
		}

		/**
		 * Moves the tooltip popup to the users mouse cursor.
		 * @private
		 * @param {Object} event The window or document mousemove event.
		 */
		function movePop(event) {
			// to support having fixed powertips on the same page as cursor
			// powertips, where both instances are referencing the same popup
			// element, we need to keep track of the mouse position constantly,
			// but we should only set the pop location if a fixed pop is not
			// currently open, a pop open is imminent or active, and the popup
			// element in question does have a mouse-follow using it.
			if ((session.isPopOpen && !session.isFixedPopOpen) || (session.popOpenImminent && !session.isFixedPopOpen && tipElement.data('hasMouseMove'))) {
				// grab measurements
				var scrollTop = $window.scrollTop(),
					windowWidth = $window.width(),
					windowHeight = $window.height(),
					popWidth = tipElement.outerWidth(),
					popHeight = tipElement.outerHeight(),
					x = 0,
					y = 0;

				// constrain pop to browser viewport
				if ((popWidth + event.pageX + options.offset) < windowWidth) {
					x = event.pageX + options.offset;
				} else {
					x = windowWidth - popWidth;
				}
				if ((popHeight + event.pageY + options.offset) < (scrollTop + windowHeight)) {
					y = event.pageY + options.offset;
				} else {
					y = scrollTop + windowHeight - popHeight;
				}

				// set the css
				tipElement.css('left', x + 'px');
				tipElement.css('top', y + 'px');
			}
		}

		/**
		 * Sets the tooltip popup too the correct position relative to the
		 * specified target element. Based on options settings.
		 * @private
		 * @param {Object} element The element that the popup should target.
		 */
		function setPopPosition(element) {
			// grab measurements
			var objectOffset = element.offset(),
				objectWidth = element.outerWidth(),
				objectHeight = element.outerHeight(),
				popWidth = tipElement.outerWidth(),
				popHeight = tipElement.outerHeight(),
				x = 0,
				y = 0;

			// calculate the appropriate x and y position in the document
			switch (options.placement) {
			case 'n':
				x = (objectOffset.left + (objectWidth / 2)) - (popWidth / 2);
				y = objectOffset.top - popHeight - options.offset;
				break;
			case 'e':
				x = objectOffset.left + objectWidth + options.offset;
				y = (objectOffset.top + (objectHeight / 2)) - (popHeight / 2);
				break;
			case 's':
				x = (objectOffset.left + (objectWidth / 2)) - (popWidth / 2);
				y = objectOffset.top + objectHeight + options.offset;
				break;
			case 'w':
				x = objectOffset.left - popWidth - options.offset;
				y = (objectOffset.top + (objectHeight / 2)) - (popHeight / 2);
				break;
			}

			tipElement.addClass(options.placement);

			// set the css position
			tipElement.css('left', Math.round(x) + 'px');
			tipElement.css('top', Math.round(y) + 'px');
		}

		/**
		 * Sets up a hover timer on the specified element.
		 * @private
		 * @param {Object} element The element that the popup should target.
		 * @param {String} action The hover timer action ('show' or 'hide').
		 */
		function setHoverTimer(element, action) {
			if (action === 'show') {
				element.data('hoverTimer', setTimeout(
					function() {
						element.data('hoverTimer', null);
						checkForIntent(element);
					},
					options.intentPollInterval
				));
			} else if (action === 'hide') {
				element.data('hoverTimer', setTimeout(
					function() {
						element.data('hoverTimer', null);
						hideTip(element);
					},
					options.closeDelay
				));
			}
		}

	};

	/**
	 * Default options for the powerTip plugin.
	 * @type Object
	 */
	$.fn.powerTip.defaults = {
		fadeInTime: 200,
		fadeOutTime: 200,
		followMouse: false,
		popupId: 'powerTip',
		intentSensitivity: 7,
		intentPollInterval: 100,
		closeDelay: 200,
		placement: 's',
		offset: 10,
		mouseOnToPopup: false
	};

	var onMoveHooked = false;
	/**
	 * Hooks the trackMouse() function to the window's mousemove event.
	 * Prevents attaching the event more than once.
	 * @private
	 */
	function hookOnMoveOnce() {
		if (!onMoveHooked) {
			onMoveHooked = true;
			$window.on('mousemove', trackMouse);
		}
	}

	/**
	 * Saves the current mouse coordinates to the powerTip session object.
	 * @private
	 * @param {Object} event The mousemove event for the document.
	 */
	function trackMouse(event) {
		session.currentX = event.pageX;
		session.currentY = event.pageY;
	}

	/**
	 * Cancels active hover timer.
	 * @private
	 * @param {Object} element The element that the popup should target.
	 */
	function cancelHoverTimer(element) {
		if (element.data('hoverTimer')) {
			clearTimeout(element.data('hoverTimer'));
			element.data('hoverTimer', null);
		}
	}

	/**
	 * Tests if the mouse is currently over the specified element.
	 * @private
	 * @param {Object} element The element to check for hover.
	 * @return {Boolean}
	 */
	function isMouseOver(element) {
		var elementPosition = element.offset();
		return session.currentX >= elementPosition.left &&
			session.currentX <= elementPosition.left + element.outerWidth() &&
			session.currentY >= elementPosition.top &&
			session.currentY <= elementPosition.top + element.outerHeight();
	}

}(jQuery));
