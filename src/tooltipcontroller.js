/**
 * PowerTip TooltipController
 *
 * @fileoverview  TooltipController object that manages tips for an instance.
 * @link          https://stevenbenner.github.io/jquery-powertip/
 * @author        Steven Benner (https://stevenbenner.com/)
 * @requires      jQuery 1.7+
 */

/**
 * Creates a new tooltip controller.
 * @private
 * @constructor
 * @param {Object} options Options object containing settings.
 */
function TooltipController(options) {
	var placementCalculator = new PlacementCalculator(),
		tipElement = $('#' + options.popupId);

	// build and append tooltip div if it does not already exist
	if (tipElement.length === 0) {
		tipElement = $('<div/>', { id: options.popupId });
		// grab body element if it was not populated when the script loaded
		// note: this hack exists solely for jsfiddle support
		if ($body.length === 0) {
			$body = $('body');
		}
		$body.append(tipElement);
		// remember the tooltip elements that the plugin has created
		session.tooltips = session.tooltips ? session.tooltips.add(tipElement) : tipElement;
	}

	// hook mousemove for cursor follow tooltips
	if (options.followMouse) {
		// only one positionTipOnCursor hook per tooltip element, please
		if (!tipElement.data(DATA_HASMOUSEMOVE)) {
			$document.on('mousemove' + EVENT_NAMESPACE, positionTipOnCursor);
			$window.on('scroll' + EVENT_NAMESPACE, positionTipOnCursor);
			tipElement.data(DATA_HASMOUSEMOVE, true);
		}
	}

	/**
	 * Gives the specified element the active-hover state and queues up the
	 * showTip function.
	 * @private
	 * @param {jQuery} element The element that the tooltip should target.
	 */
	function beginShowTip(element) {
		element.data(DATA_HASACTIVEHOVER, true);
		// show tooltip, asap
		tipElement.queue(function queueTipInit(next) {
			showTip(element);
			next();
		});
	}

	/**
	 * Shows the tooltip, as soon as possible.
	 * @private
	 * @param {jQuery} element The element that the tooltip should target.
	 */
	function showTip(element) {
		var tipContent;

		// it is possible, especially with keyboard navigation, to move on to
		// another element with a tooltip during the queue to get to this point
		// in the code. if that happens then we need to not proceed or we may
		// have the fadeout callback for the last tooltip execute immediately
		// after this code runs, causing bugs.
		if (!element.data(DATA_HASACTIVEHOVER)) {
			return;
		}

		// if the tooltip is open and we got asked to open another one then the
		// old one is still in its fadeOut cycle, so wait and try again
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

		// set tooltip content
		tipContent = getTooltipContent(element);
		if (tipContent) {
			tipElement.empty().append(tipContent);
		} else {
			// we have no content to display, give up
			return;
		}

		// trigger powerTipRender event
		element.trigger('powerTipRender');

		session.activeHover = element;
		session.isTipOpen = true;

		tipElement.data(DATA_MOUSEONTOTIP, options.mouseOnToPopup);

		// add custom class to tooltip element
		tipElement.addClass(options.popupClass);

		// set tooltip position
		// revert to static placement when the "force open" flag was set because
		// that flag means that we do not have accurate mouse position info
		if (!options.followMouse || element.data(DATA_FORCEDOPEN)) {
			positionTipOnElement(element);
			session.isFixedTipOpen = true;
		} else {
			positionTipOnCursor();
		}

		// close tooltip when clicking anywhere on the page, with the exception
		// of the tooltip's trigger element and any elements that are within a
		// tooltip that has 'mouseOnToPopup' option enabled
		// always enable this feature when the "force open" flag is set on a
		// followMouse tooltip because we reverted to static placement above
		if (!element.data(DATA_FORCEDOPEN) && !options.followMouse) {
			$document.on('click' + EVENT_NAMESPACE, function documentClick(event) {
				var target = event.target;
				if (target !== element[0]) {
					if (options.mouseOnToPopup) {
						if (target !== tipElement[0] && !$.contains(tipElement[0], target)) {
							$.powerTip.hide();
						}
					} else {
						$.powerTip.hide();
					}
				}
			});
		}

		// if we want to be able to mouse on to the tooltip then we need to
		// attach hover events to the tooltip that will cancel a close request
		// on mouseenter and start a new close request on mouseleave
		// only hook these listeners if we're not in manual mode
		if (options.mouseOnToPopup && !options.manual && $.inArray('mouseleave', options.closeEvents) > -1) {
			tipElement.on('mouseenter' + EVENT_NAMESPACE, function tipMouseEnter() {
				// check activeHover in case the mouse cursor entered the
				// tooltip during the fadeOut and close cycle
				if (session.activeHover) {
					session.activeHover.data(DATA_DISPLAYCONTROLLER).cancel();
				}
			});
			tipElement.on('mouseleave' + EVENT_NAMESPACE, function tipMouseLeave() {
				// check activeHover in case the mouse cursor left the tooltip
				// during the fadeOut and close cycle
				if (session.activeHover) {
					session.activeHover.data(DATA_DISPLAYCONTROLLER).hide();
				}
			});
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
	 * @param {jQuery} element The element that the tooltip should target.
	 */
	function hideTip(element) {
		// reset session
		session.isClosing = true;
		session.isTipOpen = false;

		// stop desync polling
		session.desyncTimeout = clearInterval(session.desyncTimeout);

		// reset element state
		element.data(DATA_HASACTIVEHOVER, false);
		element.data(DATA_FORCEDOPEN, false);

		// remove document click handler
		$document.off('click' + EVENT_NAMESPACE);

		// unbind the mouseOnToPopup events if they were set
		tipElement.off(EVENT_NAMESPACE);

		// fade out
		tipElement.fadeOut(options.fadeOutTime, function fadeOutCallback() {
			var coords = new CSSCoordinates();

			// reset session and tooltip element
			session.activeHover = null;
			session.isClosing = false;
			session.isFixedTipOpen = false;
			tipElement.removeClass();

			// support mouse-follow and fixed position tips at the same time by
			// moving the tooltip to the last cursor location after it is hidden
			coords.set('top', session.currentY + options.offset);
			coords.set('left', session.currentX + options.offset);
			tipElement.css(coords.getCompensated());

			// trigger powerTipClose event
			element.trigger('powerTipClose');
		});
	}

	/**
	 * Moves the tooltip to the user's mouse cursor.
	 * @private
	 */
	function positionTipOnCursor() {
		var tipWidth,
			tipHeight,
			coords,
			collisions,
			collisionCount;

		// to support having fixed tooltips on the same page as cursor tooltips,
		// where both instances are referencing the same tooltip element, we
		// need to keep track of the mouse position constantly, but we should
		// only set the tip location if a fixed tip is not currently open, a tip
		// open is imminent or active, and the tooltip element in question does
		// have a mouse-follow using it.
		if (!session.isFixedTipOpen && (session.isTipOpen || (session.tipOpenImminent && tipElement.data(DATA_HASMOUSEMOVE)))) {
			// grab measurements
			tipWidth = tipElement.outerWidth();
			tipHeight = tipElement.outerHeight();
			coords = new CSSCoordinates();

			// grab collisions
			coords.set('top', session.currentY + options.offset);
			coords.set('left', session.currentX + options.offset);
			collisions = getViewportCollisions(
				coords,
				tipWidth,
				tipHeight
			);

			// handle tooltip view port collisions
			if (collisions !== Collision.none) {
				collisionCount = countFlags(collisions);
				if (collisionCount === 1) {
					// if there is only one collision (bottom or right) then
					// simply constrain the tooltip to the view port
					if (collisions === Collision.right) {
						coords.set('left', session.scrollLeft + session.windowWidth - tipWidth);
					} else if (collisions === Collision.bottom) {
						coords.set('top', session.scrollTop + session.windowHeight - tipHeight);
					}
				} else {
					// if the tooltip has more than one collision then it is
					// trapped in the corner and should be flipped to get it out
					// of the user's way
					coords.set('left', session.currentX - tipWidth - options.offset);
					coords.set('top', session.currentY - tipHeight - options.offset);
				}
			}

			// position the tooltip
			tipElement.css(coords.getCompensated());
		}
	}

	/**
	 * Sets the tooltip to the correct position relative to the specified target
	 * element. Based on options settings.
	 * @private
	 * @param {jQuery} element The element that the tooltip should target.
	 */
	function positionTipOnElement(element) {
		var priorityList,
			finalPlacement;

		// when the followMouse option is enabled and the "force open" flag is
		// set we revert to static positioning. since the developer may not have
		// considered this scenario we should use smart placement
		if (options.smartPlacement || (options.followMouse && element.data(DATA_FORCEDOPEN))) {
			priorityList = $.fn.powerTip.smartPlacementLists[options.placement];

			// iterate over the priority list and use the first placement option
			// that does not collide with the view port. if they all collide
			// then the last placement in the list will be used.
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
				return collisions !== Collision.none;
			});
		} else {
			// if we're not going to use the smart placement feature then just
			// compute the coordinates and do it
			placeTooltip(element, options.placement);
			finalPlacement = options.placement;
		}

		// add placement as class for CSS arrows
		tipElement.removeClass('w nw sw e ne se n s w se-alt sw-alt ne-alt nw-alt');
		tipElement.addClass(finalPlacement);
	}

	/**
	 * Sets the tooltip position to the appropriate values to show the tip at
	 * the specified placement. This function will iterate and test the tooltip
	 * to support elastic tooltips.
	 * @private
	 * @param {jQuery} element The element that the tooltip should target.
	 * @param {string} placement The placement for the tooltip.
	 * @return {CSSCoordinates} A CSSCoordinates object with the top, left, and
	 *     right position values.
	 */
	function placeTooltip(element, placement) {
		var iterationCount = 0,
			tipWidth,
			tipHeight,
			coords = new CSSCoordinates();

		// set the tip to 0,0 to get the full expanded width
		coords.set('top', 0);
		coords.set('left', 0);
		tipElement.css(coords.getCompensated());

		// to support elastic tooltips we need to check for a change in the
		// rendered dimensions after the tooltip has been positioned
		do {
			// grab the current tip dimensions
			tipWidth = tipElement.outerWidth();
			tipHeight = tipElement.outerHeight();

			// get placement coordinates
			coords = placementCalculator.compute(
				element,
				placement,
				tipWidth,
				tipHeight,
				options.offset
			);

			// place the tooltip
			tipElement.css(coords.getCompensated());
		} while (
			// sanity check: limit to 5 iterations, and...
			++iterationCount <= 5 &&
			// try again if the dimensions changed after placement
			(tipWidth !== tipElement.outerWidth() || tipHeight !== tipElement.outerHeight())
		);

		return coords;
	}

	/**
	 * Checks for a tooltip desync and closes the tooltip if one occurs.
	 * @private
	 */
	function closeDesyncedTip() {
		var isDesynced = false,
			hasDesyncableCloseEvent = $.grep(
				[ 'mouseleave', 'mouseout', 'blur', 'focusout' ],
				function(eventType) {
					return $.inArray(eventType, options.closeEvents) !== -1;
				}
			).length > 0;

		// It is possible for the mouse cursor to leave an element without
		// firing the mouseleave or blur event. This most commonly happens when
		// the element is disabled under mouse cursor. If this happens it will
		// result in a desynced tooltip because the tooltip was never asked to
		// close. So we should periodically check for a desync situation and
		// close the tip if such a situation arises.
		if (session.isTipOpen && !session.isClosing && !session.delayInProgress && hasDesyncableCloseEvent) {
			if (session.activeHover.data(DATA_HASACTIVEHOVER) === false || session.activeHover.is(':disabled')) {
				// user moused onto another tip or active hover is disabled
				isDesynced = true;
			} else if (!isMouseOver(session.activeHover) && !session.activeHover.is(':focus') && !session.activeHover.data(DATA_FORCEDOPEN)) {
				// hanging tip - have to test if mouse position is not over the
				// active hover and not over a tooltip set to let the user
				// interact with it.
				// for keyboard navigation: this only counts if the element does
				// not have focus.
				// for tooltips opened via the api: we need to check if it has
				// the forcedOpen flag.
				if (tipElement.data(DATA_MOUSEONTOTIP)) {
					if (!isMouseOver(tipElement)) {
						isDesynced = true;
					}
				} else {
					isDesynced = true;
				}
			}

			if (isDesynced) {
				// close the desynced tip
				hideTip(session.activeHover);
			}
		}
	}

	// expose methods
	this.showTip = beginShowTip;
	this.hideTip = hideTip;
	this.resetPosition = positionTipOnElement;
}
