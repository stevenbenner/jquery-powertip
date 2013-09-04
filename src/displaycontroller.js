/**
 * PowerTip DisplayController
 *
 * @fileoverview  DisplayController object used to manage tooltips for elements.
 * @link          http://stevenbenner.github.io/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @requires      jQuery 1.7+
 */

/**
 * Creates a new tooltip display controller.
 * @private
 * @constructor
 * @param {jQuery} element The element that this controller will handle.
 * @param {Object} options Options object containing settings.
 * @param {TooltipController} tipController The TooltipController object for
 *     this instance.
 */
function DisplayController(element, options, tipController) {
	var hoverTimer = null,
		myCloseDelay = null;

	/**
	 * Begins the process of showing a tooltip.
	 * @private
	 * @param {boolean=} immediate Skip intent testing (optional).
	 * @param {boolean=} forceOpen Ignore cursor position and force tooltip to
	 *     open (optional).
	 */
	function openTooltip(immediate, forceOpen) {
		cancelTimer();
		if (!element.data(DATA_HASACTIVEHOVER)) {
			if (!immediate) {
				session.tipOpenImminent = true;
				hoverTimer = setTimeout(
					function intentDelay() {
						hoverTimer = null;
						checkForIntent();
					},
					options.intentPollInterval
				);
			} else {
				if (forceOpen) {
					element.data(DATA_FORCEDOPEN, true);
				}
				tipController.showTip(element);
			}
		} else {
			// cursor left and returned to this element, cancel close
			cancelClose();
		}
	}

	/**
	 * Begins the process of closing a tooltip.
	 * @private
	 * @param {boolean=} disableDelay Disable close delay (optional).
	 */
	function closeTooltip(disableDelay) {
		cancelTimer();
		session.tipOpenImminent = false;
		if (element.data(DATA_HASACTIVEHOVER)) {
			element.data(DATA_FORCEDOPEN, false);
			if (!disableDelay) {
				session.delayInProgress = true;
				session.closeDelayTimeout = setTimeout(
					function closeDelay() {
						session.closeDelayTimeout = null;
						tipController.hideTip(element);
						session.delayInProgress = false;
						myCloseDelay = null;
					},
					options.closeDelay
				);
				// save internal reference close delay id so we can check if the
				// active close delay belongs to this instance
				myCloseDelay = session.closeDelayTimeout;
			} else {
				tipController.hideTip(element);
			}
		}
	}

	/**
	 * Checks mouse position to make sure that the user intended to hover on the
	 * specified element before showing the tooltip.
	 * @private
	 */
	function checkForIntent() {
		// calculate mouse position difference
		var xDifference = Math.abs(session.previousX - session.currentX),
			yDifference = Math.abs(session.previousY - session.currentY),
			totalDifference = xDifference + yDifference;

		// check if difference has passed the sensitivity threshold
		if (totalDifference < options.intentSensitivity) {
			cancelClose();
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
	 * @param {boolean=} stopClose Cancel any active close delay timer.
	 */
	function cancelTimer(stopClose) {
		hoverTimer = clearTimeout(hoverTimer);
		// cancel the current close delay if the active close delay is for this
		// element or the stopClose argument is true
		if (session.closeDelayTimeout && myCloseDelay === session.closeDelayTimeout || stopClose) {
			cancelClose();
		}
	}

	/**
	 * Cancels any active close delay timer.
	 * @private
	 */
	function cancelClose() {
		session.closeDelayTimeout = clearTimeout(session.closeDelayTimeout);
		session.delayInProgress = false;
	}

	/**
	 * Repositions the tooltip on this element.
	 * @private
	 */
	function repositionTooltip() {
		tipController.resetPosition(element);
	}

	// expose the methods
	this.show = openTooltip;
	this.hide = closeTooltip;
	this.cancel = cancelTimer;
	this.resetPosition = repositionTooltip;
}
