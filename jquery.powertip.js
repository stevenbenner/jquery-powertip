/**
 * PowerTip
 *
 * @fileoverview  jQuery plugin that creates hover tooltips.
 * @link          http://stevenbenner.github.com/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @version       1.1.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery PowerTip Plugin v1.1.0
 * http://stevenbenner.github.com/jquery-powertip/
 * Copyright 2012 Steven Benner (http://stevenbenner.com/)
 * Released under the MIT license.
 * <https://raw.github.com/stevenbenner/jquery-powertip/master/LICENSE.txt>
 */

(function($) {
	'use strict';

	// useful private variables
	var $document = $(document),
		$window = $(window),
		$body = $('body');

	/**
	 * Session data
	 * Private properties global to all powerTip instances
	 * @type Object
	 */
	var session = {
		isTipOpen: false,
		isFixedTipOpen: false,
		isClosing: false,
		tipOpenImminent: false,
		activeHover: null,
		currentX: 0,
		currentY: 0,
		previousX: 0,
		previousY: 0,
		desyncTimeout: null,
		mouseTrackingActive: false
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
		var options = $.extend({}, $.fn.powerTip.defaults, opts),
			tipController = new TooltipController(options);

		// hook mouse tracking
		initMouseTracking();

		// setup the elements
		this.each(function elementSetup() {
			var $this = $(this),
				dataPowertip = $this.data('powertip'),
				dataElem = $this.data('powertipjq'),
				dataTarget = $this.data('powertiptarget'),
				title = $this.attr('title');

			// attempt to use title attribute text if there is no data-powertip,
			// data-powertipjq or data-powertiptarget. If we do use the title
			// attribute, delete the attribute so the browser will not show it
			if (!dataPowertip && !dataTarget && !dataElem && title) {
				$this.data('powertip', title).removeAttr('title');
			}

			// create hover controllers for each element
			$this.data(
				'displayController',
				new DisplayController($this, options, tipController)
			);
		});

		// attach hover events to all matched elements
		this.on({
			// mouse events
			mouseenter: function elementMouseEnter(event) {
				trackMouse(event);
				session.previousX = event.pageX;
				session.previousY = event.pageY;
				$(this).data('displayController').show();
			},
			mouseleave: function elementMouseLeave() {
				$(this).data('displayController').hide();
			},

			// keyboard events
			focus: function elementFocus() {
				$(this).data('displayController').show(true);
			},
			blur: function elementBlur() {
				$(this).data('displayController').hide(true);
			},
			keydown: function elementKeyDown(event) {
				// close tooltip when the escape key is pressed
				if (event.keyCode === 27) {
					$(this).data('displayController').hide(true);
				}
			}
		});

		return this;

	};

	/**
	 * Default options for the powerTip plugin.
	 * @type Object
	 */
	$.fn.powerTip.defaults = {
		fadeInTime: 200,
		fadeOutTime: 100,
		followMouse: false,
		popupId: 'powerTip',
		intentSensitivity: 7,
		intentPollInterval: 100,
		closeDelay: 100,
		placement: 'n',
		smartPlacement: false,
		offset: 10,
		mouseOnToPopup: false
	};

	/**
	 * Default smart placement priority lists.
	 * The first item in the array is the highest priority, the last is the
	 * lowest. The last item is also the default, which will be used if all
	 * previous options do not fit.
	 * @type Object
	 */
	$.fn.powerTip.smartPlacementLists = {
		n: ['n', 'ne', 'nw', 's'],
		e: ['e', 'ne', 'se', 'w', 'nw', 'sw', 'n', 's', 'e'],
		s: ['s', 'se', 'sw', 'n'],
		w: ['w', 'nw', 'sw', 'e', 'ne', 'se', 'n', 's', 'w'],
		nw: ['nw', 'w', 'sw', 'n', 's', 'se', 'nw'],
		ne: ['ne', 'e', 'se', 'n', 's', 'sw', 'ne'],
		sw: ['sw', 'w', 'nw', 's', 'n', 'ne', 'sw'],
		se: ['se', 'e', 'ne', 's', 'n', 'nw', 'se']
	};

	/**
	 * Public API
	 * @type Object
	 */
	$.powerTip = {

		/**
		 * Attempts to show the tooltip for the specified element.
		 * @public
		 * @param {Object} element The element that the tooltip should for.
		 */
		showTip: function apiShowTip(element) {
			// grab only the first matched element and ask it to show its tip
			element = element.first();
			element.data('displayController').show(true, true);
		},

		/**
		 * Attempts to close any open tooltips.
		 * @public
		 */
		closeTip: function apiCloseTip() {
			$document.triggerHandler('closePowerTip');
		}

	};

	/**
	 * Creates a new tooltip display controller.
	 * @private
	 * @constructor
	 * @param {Object} element The element that this controller will handle.
	 * @param {Object} options Options object containing settings.
	 * @param {TooltipController} tipController The TooltipController for this instance.
	 */
	function DisplayController(element, options, tipController) {
		var hoverTimer = null;

		/**
		 * Begins the process of showing a tooltip.
		 * @private
		 * @param {Boolean=} immediate Skip intent testing (optional).
		 * @param {Boolean=} forceOpen Ignore cursor position and force tooltip to open (optional).
		 */
		function openTooltip(immediate, forceOpen) {
			cancelTimer();
			if (!element.data('hasActiveHover')) {
				if (!immediate) {
					session.tipOpenImminent = true;
					hoverTimer = setTimeout(
						function intentDelay() {
							hoverTimer = null;
							checkForIntent(element);
						},
						options.intentPollInterval
					);
				} else {
					if (forceOpen) {
						element.data('forcedOpen', true);
					}
					tipController.showTip(element);
				}
			}
		}

		/**
		 * Begins the process of closing a tooltip.
		 * @private
		 * @param {Boolean=} disableDelay Disable close delay (optional).
		 */
		function closeTooltip(disableDelay) {
			cancelTimer();
			session.tipOpenImminent = false;
			if (element.data('hasActiveHover')) {
				element.data('forcedOpen', false);
				if (!disableDelay) {
					hoverTimer = setTimeout(
						function closeDelay() {
							hoverTimer = null;
							tipController.hideTip(element);
						},
						options.closeDelay
					);
				} else {
					tipController.hideTip(element);
				}
			}
		}

		/**
		 * Checks mouse position to make sure that the user intended to hover
		 * on the specified element before showing the tooltip.
		 * @private
		 */
		function checkForIntent() {
			// calculate mouse position difference
			var xDifference = Math.abs(session.previousX - session.currentX),
				yDifference = Math.abs(session.previousY - session.currentY),
				totalDifference = xDifference + yDifference;

			// check if difference has passed the sensitivity threshold
			if (totalDifference < options.intentSensitivity) {
				tipController.showTip(element);
			} else {
				// try again
				session.previousX = session.currentX;
				session.previousY = session.currentY;
				openTooltip();
			}
		}

		/**
		 * Cancels active hover timer.
		 * @private
		 */
		function cancelTimer() {
			hoverTimer = clearTimeout(hoverTimer);
		}

		// expose the methods
		return {
			show: openTooltip,
			hide: closeTooltip,
			cancel: cancelTimer
		};
	}

	/**
	 * Creates a new tooltip controller.
	 * @private
	 * @constructor
	 * @param {Object} options Options object containing settings.
	 */
	function TooltipController(options) {

		// build and append tooltip div if it does not already exist
		var tipElement = $('#' + options.popupId);
		if (tipElement.length === 0) {
			tipElement = $('<div/>', { id: options.popupId });
			// grab body element if it was not populated when the script loaded
			// this hack exists solely for jsfiddle support
			if ($body.length === 0) {
				$body = $('body');
			}
			$body.append(tipElement);
		}

		// hook mousemove for cursor follow tooltips
		if (options.followMouse) {
			// only one positionTipOnCursor hook per tooltip element, please
			if (!tipElement.data('hasMouseMove')) {
				$document.on({
					mousemove: positionTipOnCursor,
					scroll: positionTipOnCursor
				});
				tipElement.data('hasMouseMove', true);
			}
		}

		// if we want to be able to mouse onto the tooltip then we need to
		// attach hover events to the tooltip that will cancel a close request
		// on hover and start a new close request on mouseleave
		if (options.mouseOnToPopup) {
			tipElement.on({
				mouseenter: function tipMouseEnter() {
					// we only let the mouse stay on the tooltip if it is set
					// to let users interact with it
					if (tipElement.data('mouseOnToPopup')) {
						// check activeHover in case the mouse cursor entered
						// the tooltip during the fadeOut and close cycle
						if (session.activeHover) {
							session.activeHover.data('displayController').cancel();
						}
					}
				},
				mouseleave: function tipMouseLeave() {
					// check activeHover in case the mouse cursor entered
					// the tooltip during the fadeOut and close cycle
					if (session.activeHover) {
						session.activeHover.data('displayController').hide();
					}
				}
			});
		}

		/**
		 * Gives the specified element the active-hover state and queues up
		 * the showTip function.
		 * @private
		 * @param {Object} element The element that the tooltip should target.
		 */
		function beginShowTip(element) {
			element.data('hasActiveHover', true);
			// show tooltip, asap
			tipElement.queue(function queueTipInit(next) {
				showTip(element);
				next();
			});
		}

		/**
		 * Shows the tooltip, as soon as possible.
		 * @private
		 * @param {Object} element The element that the tooltip should target.
		 */
		function showTip(element) {
			// it is possible, especially with keyboard navigation, to move on
			// to another element with a tooltip during the queue to get to
			// this point in the code. if that happens then we need to not
			// proceed or we may have the fadeout callback for the last tooltip
			// execute immediately after this code runs, causing bugs.
			if (!element.data('hasActiveHover')) {
				return;
			}

			// if the tooltip is open and we got asked to open another one then
			// the old one is still in its fadeOut cycle, so wait and try again
			if (session.isTipOpen) {
				if (!session.isClosing) {
					hideTip(session.activeHover);
				}
				tipElement.delay(100).queue(function queueTipAgain(next) {
					showTip(element);
					next();
				});
				return;
			}

			// trigger powerTipPreRender event
			element.trigger('powerTipPreRender');

			var tipText = element.data('powertip'),
				tipTarget = element.data('powertiptarget'),
				tipElem = element.data('powertipjq'),
				tipContent = tipTarget ? $('#' + tipTarget) : [];

			// set tooltip content
			if (tipText) {
				tipElement.html(tipText);
			} else if (tipElem && tipElem.length > 0) {
				tipElement.empty();
				tipElem.clone(true, true).appendTo(tipElement);
			} else if (tipContent && tipContent.length > 0) {
				tipElement.html($('#' + tipTarget).html());
			} else {
				// we have no content to display, give up
				return;
			}

			// trigger powerTipRender event
			element.trigger('powerTipRender');

			// hook close event for triggering from the api
			$document.on('closePowerTip', function closePowerTipEvent() {
				element.data('displayController').hide(true);
			});

			session.activeHover = element;
			session.isTipOpen = true;

			tipElement.data('followMouse', options.followMouse);
			tipElement.data('mouseOnToPopup', options.mouseOnToPopup);

			// set tooltip position
			if (!options.followMouse) {
				positionTipOnElement(element);
				session.isFixedTipOpen = true;
			} else {
				positionTipOnCursor();
			}

			// fadein
			tipElement.fadeIn(options.fadeInTime, function fadeInCallback() {
				// start desync polling
				if (!session.desyncTimeout) {
					session.desyncTimeout = setInterval(closeDesyncedTip, 500);
				}

				// trigger powerTipOpen event
				element.trigger('powerTipOpen');
			});
		}

		/**
		 * Hides the tooltip.
		 * @private
		 * @param {Object} element The element that the tooltip should target.
		 */
		function hideTip(element) {
			session.isClosing = true;
			element.data('hasActiveHover', false);
			element.data('forcedOpen', false);
			// reset session
			session.activeHover = null;
			session.isTipOpen = false;
			// stop desync polling
			session.desyncTimeout = clearInterval(session.desyncTimeout);
			// unhook close event api listener
			$document.off('closePowerTip');
			// fade out
			tipElement.fadeOut(options.fadeOutTime, function fadeOutCallback() {
				session.isClosing = false;
				session.isFixedTipOpen = false;
				tipElement.removeClass();
				// support mouse-follow and fixed position tips at the same
				// time by moving the tooltip to the last known cursor location
				// after it is hidden
				setTipPosition(
					session.currentX + options.offset,
					session.currentY + options.offset
				);

				// trigger powerTipClose event
				element.trigger('powerTipClose');
			});
		}

		/**
		 * Checks for a tooltip desync and closes the tooltip if one occurs.
		 * @private
		 */
		function closeDesyncedTip() {
			// It is possible for the mouse cursor to leave an element without
			// firing the mouseleave or blur event. This most commonly happens
			// when the element is disabled under mouse cursor. If this happens
			// it will result in a desynced tooltip because the tooltip was
			// never asked to close. So we should periodically check for a
			// desync situation and close the tip if such a situation arises.
			if (session.isTipOpen && !session.isClosing) {
				var isDesynced = false;
				// user moused onto another tip or active hover is disabled
				if (session.activeHover.data('hasActiveHover') === false || session.activeHover.is(':disabled')) {
					isDesynced = true;
				} else {
					// hanging tip - have to test if mouse position is not over
					// the active hover and not over a tooltip set to let the
					// user interact with it.
					// for keyboard navigation: this only counts if the element
					// does not have focus.
					// for tooltips opened via the api: we need to check if it
					// has the forcedOpen flag.
					if (!isMouseOver(session.activeHover) && !session.activeHover.is(":focus") && !session.activeHover.data('forcedOpen')) {
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
		 * Moves the tooltip to the users mouse cursor.
		 * @private
		 */
		function positionTipOnCursor() {
			// to support having fixed tooltips on the same page as cursor
			// tooltips, where both instances are referencing the same tooltip
			// element, we need to keep track of the mouse position constantly,
			// but we should only set the tip location if a fixed tip is not
			// currently open, a tip open is imminent or active, and the
			// tooltip element in question does have a mouse-follow using it.
			if ((session.isTipOpen && !session.isFixedTipOpen) || (session.tipOpenImminent && !session.isFixedTipOpen && tipElement.data('hasMouseMove'))) {
				// grab measurements and collisions
				var tipWidth = tipElement.outerWidth(),
					tipHeight = tipElement.outerHeight(),
					x = session.currentX + options.offset,
					y = session.currentY + options.offset,
					collisions = getViewportCollisions(
						{ left: x, top: y },
						tipWidth,
						tipHeight
					),
					collisionCount = collisions.length;

				// handle tooltip view port collisions
				if (collisionCount > 0) {
					if (collisionCount === 1) {
						// if there is only one collision (bottom or right) then
						// simply constrain the tooltip to the view port
						if (collisions[0] === 'right') {
							x = $window.width() - tipWidth;
						} else if (collisions[0] === 'bottom') {
							y = $window.scrollTop() + $window.height() - tipHeight;
						}
					} else {
						// if the tooltip has more than one collision then it
						// is trapped in the corner and should be flipped to
						// get it out of the users way
						x = session.currentX - tipWidth - options.offset;
						y = session.currentY - tipHeight - options.offset;
					}
				}

				// position the tooltip
				setTipPosition(x, y);
			}
		}

		/**
		 * Sets the tooltip to the correct position relative to the specified
		 * target element. Based on options settings.
		 * @private
		 * @param {Object} element The element that the tooltip should target.
		 */
		function positionTipOnElement(element) {
			var priorityList,
				finalPlacement;

			if (options.smartPlacement) {
				priorityList = $.fn.powerTip.smartPlacementLists[options.placement];

				// iterate over the priority list and use the first placement
				// option that does not collide with the view port. if they all
				// collide then the last placement in the list will be used.
				$.each(priorityList, function(idx, pos) {
					// place tooltip and find collisions
					var collisions = getViewportCollisions(
						placeTooltip(element, pos),
						tipElement.outerWidth(),
						tipElement.outerHeight()
					);

					// update the final placement variable
					finalPlacement = pos;

					// break if there were no collisions
					if (collisions.length === 0) {
						return false;
					}
				});
			} else {
				// if we're not going to use the smart placement feature then
				// just compute the coordinates and do it
				placeTooltip(element, options.placement);
				finalPlacement = options.placement;
			}

			// add placement as class for CSS arrows
			tipElement.addClass(finalPlacement);
		}

		/**
		 * Sets the tooltip position to the appropriate values to show the tip
		 * at the specified placement. This function will iterate and test the
		 * tooltip to support elastic tooltips.
		 * @private
		 * @param {Object} element The element that the tooltip should target.
		 * @param {String} placement The placement for the tooltip.
		 * @retun {Object} An object with the top, left, and right position values.
		 */
		function placeTooltip(element, placement) {
			var iterationCount = 0,
				tipWidth,
				tipHeight,
				coords;

			// for the first iteration: set the tip to 0,0 to get the full
			// expanded width and set the iterationCount to 0
			setTipPosition(0, 0);

			// to support elastic tooltips we need to check for a change in
			// the rendered dimensions after the tooltip has been positioned
			do {
				// grab the current tip dimensions
				tipWidth = tipElement.outerWidth();
				tipHeight = tipElement.outerHeight();

				// get placement coordinates
				coords = computePlacementCoords(
					element,
					placement,
					tipWidth,
					tipHeight
				);

				// place the tooltip
				tipElement.css(coords);
			} while (
				// sanity check: limit to 5 iterations, and...
				++iterationCount <= 5 &&
				// try again if the dimensions changed after placement
				(tipWidth !== tipElement.outerWidth() || tipHeight !== tipElement.outerHeight())
			);

			return coords;
		}

		/**
		 * Compute the top/left/right CSS position to display the tooltip at the
		 * specified placement relative to the specified element.
		 * @private
		 * @param {Object} element The element that the tooltip should target.
		 * @param {String} placement The placement for the tooltip.
		 * @param {Number} tipWidth Width of the tooltip element in pixels.
		 * @param {Number} tipHeight Height of the tooltip element in pixels.
		 * @retun {Object} An object with the top, left, and right position values.
		 */
		function computePlacementCoords(element, placement, tipWidth, tipHeight) {
			// grab measurements
			var objectOffset = element.offset(),
				objectWidth = element.outerWidth(),
				objectHeight = element.outerHeight(),
				left = 'auto',
				top = 'auto',
				right = 'auto';

			// calculate the appropriate x and y position in the document
			switch (placement) {
			case 'n':
				left = Math.round((objectOffset.left + (objectWidth / 2)) - (tipWidth / 2));
				top = Math.round(objectOffset.top - tipHeight - options.offset);
				break;
			case 'e':
				left = Math.round(objectOffset.left + objectWidth + options.offset);
				top = Math.round((objectOffset.top + (objectHeight / 2)) - (tipHeight / 2));
				break;
			case 's':
				left = Math.round((objectOffset.left + (objectWidth / 2)) - (tipWidth / 2));
				top = Math.round(objectOffset.top + objectHeight + options.offset);
				break;
			case 'w':
				//left = objectOffset.left - tipWidth - options.offset;
				top = Math.round((objectOffset.top + (objectHeight / 2)) - (tipHeight / 2));
				right = Math.round($window.width() - objectOffset.left + options.offset);
				break;
			case 'nw':
				//left = (objectOffset.left - tipWidth) + 20;
				top = Math.round(objectOffset.top - tipHeight - options.offset);
				right = Math.round($window.width() - objectOffset.left - 20);
				break;
			case 'ne':
				left = Math.round((objectOffset.left + objectWidth) - 20);
				top = Math.round(objectOffset.top - tipHeight - options.offset);
				break;
			case 'sw':
				//left = (objectOffset.left - tipWidth) + 20;
				top = Math.round(objectOffset.top + objectHeight + options.offset);
				right = Math.round($window.width() - objectOffset.left - 20);
				break;
			case 'se':
				left = Math.round((objectOffset.left + objectWidth) - 20);
				top = Math.round(objectOffset.top + objectHeight + options.offset);
				break;
			}

			return {
				left: left,
				top: top,
				right: right
			};
		}

		/**
		 * Sets the tooltip CSS position on the document.
		 * @private
		 * @param {Number} x Left position in pixels.
		 * @param {Number} y Top position in pixels.
		 */
		function setTipPosition(x, y) {
			tipElement.css({
				left: x + 'px',
				top: y + 'px',
				right: 'auto'
			});
		}

		// expose methods
		return {
			showTip: beginShowTip,
			hideTip: hideTip
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
	 * @param {Object} event The mousemove event for the document.
	 */
	function trackMouse(event) {
		session.currentX = event.pageX;
		session.currentY = event.pageY;
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

	/**
	 * Finds any viewport collisions that an element (the tooltip) would have
	 * if it were absolutely positioned at the specified coordinates.
	 * @private
	 * @param {Object} coords Coordinates for the element. (e.g. {top: 123, left: 123})
	 * @param {Number} elementWidth Width of the element in pixels.
	 * @param {Number} elementHeight Height of the element in pixels.
	 * @return {Array} Array of words representing directional collisions.
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

}(jQuery));
