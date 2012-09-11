/**
 * PowerTip TooltipController
 *
 * @fileoverview  TooltipController object that manages tooltips for an instance.
 * @link          http://stevenbenner.github.com/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @version       1.1.0
 * @requires      jQuery 1.7+
 */

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
			if (typeof tipText === 'function') {
				tipText = tipText.call(element[0]);
			}
			tipElement.html(tipText);
		} else if (tipElem) {
			if (typeof tipElem === 'function') {
				tipElem = tipElem.call(element[0]);
			}
			if (tipElem.length > 0) {
				tipElem = tipElem.clone(true, true);
				tipElement.empty().append(tipElem);
			}
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
	 * @return {Object} An object with the top, left, and right position values.
	 */
	function placeTooltip(element, placement) {
		var iterationCount = 0,
			tipWidth,
			tipHeight,
			coords;

		// for the first iteration set the tip to 0,0 to get the full
		// expanded width
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
	 * Compute the top,left position of the specified placement for an HTML element
	 * @private
	 * @param {Object} element The element that the tooltip should target.
	 * @param {String} placement The placement for the tooltip.
	 * @return {Object} An object with the top,left position values.
	 */
	function getHtmlPlacement(element, placement) {
		// grab measurements
		var objectOffset = element.offset(),
			objectLeft = objectOffset.left,
			objectTop = objectOffset.top,
			objectWidth = element.outerWidth(),
			objectHeight = element.outerHeight(),
			halfWidth = objectWidth / 2,
			halfHeight = objectHeight / 2,
			left, top;

		// calculate the appropriate x and y position in the document
		switch (placement) {
		case 'n':
			left = objectLeft + halfWidth;
			top = objectTop;
			break;
		case 'e':
			left = objectLeft + objectWidth;
			top = objectTop + halfHeight;
			break;
		case 's':
			left = objectLeft + halfWidth;
			top = objectTop + objectHeight;
			break;
		case 'w':
			left = objectLeft;
			top = objectTop + halfHeight;
			break;
		case 'nw':
			left = objectLeft;
			top = objectTop;
			break;
		case 'ne':
			left = objectLeft + objectWidth;
			top = objectTop;
			break;
		case 'sw':
			left = objectLeft;
			top = objectTop + objectHeight;
			break;
		case 'se':
			left = objectLeft + objectWidth;
			top = objectTop + objectHeight;
			break;
		}

		return {
			top: top,
			left: left
		};
	}

	/**
	 * Compute the top,left position of the specified placement for a SVG element
	 * @private
	 * @param {Object} element The element that the tooltip should target.
	 * @param {String} placement The placement for the tooltip.
	 * @return {Object} An object with the top,left position values.
	 */
	function getSvgPlacement(element, placement) {
		var svg = element.closest('svg')[0],
			el = element[0],
			pt = svg.createSVGPoint(),
			// get the bounding box and matrix
			bbox = el.getBBox(),
			matrix = el.getScreenCTM(),
			halfWidth = bbox.width / 2,
			halfHeight = bbox.height / 2,
			placements = [],
			placementKeys = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'],
			coords, rotation, steps, x;

		function pushPlacement() {
			placements.push(pt.matrixTransform(matrix));
		}

		// get bbox corners and midpoints
		pt.x = bbox.x;
		pt.y = bbox.y;
		pushPlacement();
		pt.x += halfWidth;
		pushPlacement();
		pt.x += halfWidth;
		pushPlacement();
		pt.y += halfHeight;
		pushPlacement();
		pt.y += halfHeight;
		pushPlacement();
		pt.x -= halfWidth;
		pushPlacement();
		pt.x -= halfWidth;
		pushPlacement();
		pt.y -= halfHeight;
		pushPlacement();

		// determine rotation
		if (placements[0].y !== placements[1].y || placements[0].x !== placements[7].x) {
			rotation = Math.atan2(matrix.b, matrix.a) * RAD2DEG;
			steps = Math.ceil(((rotation % 360) - 22.5) / 45);
			if (steps < 1) {
				steps += 8;
			}
			while (steps--) {
				placementKeys.push(placementKeys.shift());
			}
		}

		// find placement
		for (x=0; x<placements.length; x++) {
			if (placementKeys[x] === placement) {
				coords = placements[x];
				break;
			}
		}

		return {
			top: coords.y + $window.scrollTop(),
			left: coords.x + $window.scrollLeft()
		};
	}

	/**
	 * Compute the top/left/right CSS position to display the tooltip at the
	 * specified placement relative to the specified element.
	 * @private
	 * @param {Object} element The element that the tooltip should target.
	 * @param {String} placement The placement for the tooltip.
	 * @param {Number} tipWidth Width of the tooltip element in pixels.
	 * @param {Number} tipHeight Height of the tooltip element in pixels.
	 * @return {Object} An object with the top, left, and right position values.
	 */
	function computePlacementCoords(element, placement, tipWidth, tipHeight) {
		var placementBase = placement.split('-')[0], // ignore 'alt' for corners
			pos = isSvgElement(element) ?
				getSvgPlacement(element, placementBase) :
				getHtmlPlacement(element, placementBase),
			pLeft = pos.left,
			pTop = pos.top,
			left = 'auto',
			top = 'auto',
			right = 'auto';

		// calculate the appropriate x and y position in the document
		// ~~ here is a shorthand for Math.floor
		switch (placement) {
		case 'n':
			left = ~~(pLeft - (tipWidth / 2));
			top = ~~(pTop - tipHeight - options.offset);
			break;
		case 'e':
			left = ~~(pLeft + options.offset);
			top = ~~(pTop - (tipHeight / 2));
			break;
		case 's':
			left = ~~(pLeft - (tipWidth / 2));
			top = ~~(pTop + options.offset);
			break;
		case 'w':
			top = ~~(pTop - (tipHeight / 2));
			right = ~~($window.width() - pLeft + options.offset);
			break;
		case 'nw':
			top = ~~(pTop - tipHeight - options.offset);
			right = ~~($window.width() - pLeft - 20);
			break;
		case 'nw-alt':
			left = ~~pLeft;
			top = ~~(pTop - tipHeight - options.offset);
			break;
		case 'ne':
			left = ~~(pLeft - 20);
			top = ~~(pTop - tipHeight - options.offset);
			break;
		case 'ne-alt':
			top = ~~(pTop - tipHeight - options.offset);
			right = ~~($window.width() - pLeft);
			break;
		case 'sw':
			top = ~~(pTop + options.offset);
			right = ~~($window.width() - pLeft - 20);
			break;
		case 'sw-alt':
			left = ~~pLeft;
			top = ~~(pTop + options.offset);
			break;
		case 'se':
			left = ~~(pLeft - 20);
			top = ~~(pTop + options.offset);
			break;
		case 'se-alt':
			top = ~~(pTop + options.offset);
			right = ~~($window.width() - pLeft);
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
		hideTip: hideTip,
		resetPosition: positionTipOnElement
	};
}
