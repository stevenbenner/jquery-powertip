/**
 * PowerTip Core
 *
 * @fileoverview  Core variables, plugin object, and API.
 * @link          http://stevenbenner.github.com/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @requires      jQuery 1.7+
 */

// useful private variables
var $document = $(window.document),
	$window = $(window),
	$body = $('body'),
	// constants
	DATA_DISPLAYCONTROLLER = 'displayController',
	DATA_HASACTIVEHOVER = 'hasActiveHover',
	DATA_FORCEDOPEN = 'forcedOpen',
	DATA_HASMOUSEMOVE = 'hasMouseMove',
	DATA_MOUSEONTOTIP = 'mouseOnToPopup',
	DATA_ORIGINALTITLE = 'originalTitle',
	DATA_POWERTIP = 'powertip',
	DATA_POWERTIPJQ = 'powertipjq',
	DATA_POWERTIPTARGET = 'powertiptarget',
	RAD2DEG = 180 / Math.PI;

/**
 * Session data
 * Private properties global to all powerTip instances
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
 * @param {(Object|string)} opts The options object to use for the plugin, or the
 *     name of a method to invoke on the first matched element.
 * @param {*=} [arg] Argument for an invoked method (optional).
 * @return {jQuery} jQuery object for the matched selectors.
 */
$.fn.powerTip = function(opts, arg) {

	// don't do any work if there were no matched elements
	if (!this.length) {
		return this;
	}

	// handle api method calls on the plugin, e.g. powerTip('hide')
	if (typeof opts === 'string' && $.powerTip[opts]) {
		return $.powerTip[opts].call(this, this, arg);
	}

	// extend options
	var options = $.extend({}, $.fn.powerTip.defaults, opts),
		tipController = new TooltipController(options);

	// hook mouse tracking
	initMouseTracking();

	// setup the elements
	this.each(function elementSetup() {
		var $this = $(this),
			dataPowertip = $this.data(DATA_POWERTIP),
			dataElem = $this.data(DATA_POWERTIPJQ),
			dataTarget = $this.data(DATA_POWERTIPTARGET),
			title = $this.attr('title');

		// handle repeated powerTip calls on the same element by destroying
		// the original instance hooked to it and replacing it with this call
		if ($this.data(DATA_DISPLAYCONTROLLER)) {
			$.powerTip.destroy($this);
			title = $this.attr('title');
		}

		// attempt to use title attribute text if there is no data-powertip,
		// data-powertipjq or data-powertiptarget. If we do use the title
		// attribute, delete the attribute so the browser will not show it
		if (!dataPowertip && !dataTarget && !dataElem && title) {
			$this.data(DATA_POWERTIP, title);
			$this.data(DATA_ORIGINALTITLE, title);
			$this.removeAttr('title');
		}

		// create hover controllers for each element
		$this.data(
			DATA_DISPLAYCONTROLLER,
			new DisplayController($this, options, tipController)
		);
	});

	// attach events to matched elements if the manual options is not enabled
	if (!options.manual) {
		this.on({
			// mouse events
			'mouseenter.powertip': function elementMouseEnter(event) {
				elementShowAndTrack(this, event);
			},
			'mouseleave.powertip': function elementMouseLeave() {
				elementHideTip(this);
			},

			// keyboard events
			'focus.powertip': function elementFocus() {
				elementShowTip(this, true);
			},
			'blur.powertip': function elementBlur() {
				elementHideTip(this, true);
			},
			'keydown.powertip': function elementKeyDown(event) {
				// close tooltip when the escape key is pressed
				if (event.keyCode === 27) {
					elementHideTip(this, true);
				}
			}
		});
	}

	return this;

};

/**
 * Default options for the powerTip plugin.
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
	mouseOnToPopup: false,
	manual: false
};

/**
 * Default smart placement priority lists.
 * The first item in the array is the highest priority, the last is the
 * lowest. The last item is also the default, which will be used if all
 * previous options do not fit.
 */
$.fn.powerTip.smartPlacementLists = {
	n: ['n', 'ne', 'nw', 's'],
	e: ['e', 'ne', 'se', 'w', 'nw', 'sw', 'n', 's', 'e'],
	s: ['s', 'se', 'sw', 'n'],
	w: ['w', 'nw', 'sw', 'e', 'ne', 'se', 'n', 's', 'w'],
	nw: ['nw', 'w', 'sw', 'n', 's', 'se', 'nw'],
	ne: ['ne', 'e', 'se', 'n', 's', 'sw', 'ne'],
	sw: ['sw', 'w', 'nw', 's', 'n', 'ne', 'sw'],
	se: ['se', 'e', 'ne', 's', 'n', 'nw', 'se'],
	'nw-alt': ['nw-alt', 'n', 'ne-alt', 'nw', 'ne', 'w', 'sw-alt', 's', 'se-alt', 'sw', 'se', 'e'],
	'ne-alt': ['ne-alt', 'n', 'nw-alt', 'ne', 'nw', 'e', 'se-alt', 's', 'sw-alt', 'se', 'sw', 'w'],
	'sw-alt': ['sw-alt', 's', 'se-alt', 'sw', 'se', 'w', 'nw-alt', 'n', 'ne-alt', 'nw', 'ne', 'e'],
	'se-alt': ['se-alt', 's', 'sw-alt', 'se', 'sw', 'e', 'ne-alt', 'n', 'nw-alt', 'ne', 'nw', 'w']
};

/**
 * Public API
 */
$.powerTip = {

	/**
	 * Attempts to show the tooltip for the specified element.
	 * @public
	 * @param {jQuery} element The element that the tooltip should for.
	 * @param {jQuery.Event=} event jQuery event for hover intent and mouse tracking (optional).
	 */
	showTip: function apiShowTip(element, event) {
		if (event) {
			elementShowAndTrack(element.first(), event);
		} else {
			elementShowTip(element.first(), true, true);
		}
		return element;
	},

	/**
	 * Repositions the tooltip on the element.
	 * @public
	 * @param {jQuery} element The element that the tooltip is shown for.
	 */
	resetPosition: function apiResetPosition(element) {
		element.first().data(DATA_DISPLAYCONTROLLER).resetPosition();
		return element;
	},

	/**
	 * Attempts to close any open tooltips.
	 * @public
	 * @param {jQuery=} element A specific element whose tip should be closed (optional).
	 * @param {boolean=} immediate Disable close delay (optional).
	 */
	closeTip: function apiCloseTip(element, immediate) {
		if (element) {
			elementHideTip(element.first(), immediate);
		} else {
			if (session.activeHover) {
				elementHideTip(session.activeHover, true);
			}
		}
		return element;
	},

	/**
	 * Destroy and roll back any powerTip() instance on the specified element.
	 * @public
	 * @param {jQuery} element The element with the powerTip instance.
	 */
	destroy: function apiDestroy(element) {
		return element.off('.powertip').each(function destroy() {
			var $this = $(this);

			if ($this.data(DATA_ORIGINALTITLE)) {
				$this.attr('title', $this.data(DATA_ORIGINALTITLE));
			}

			$this.removeData([
				DATA_ORIGINALTITLE,
				DATA_DISPLAYCONTROLLER,
				DATA_HASACTIVEHOVER,
				DATA_FORCEDOPEN
			]);
		});
	}

};

// API aliasing
$.powerTip.show = $.powerTip.showTip;
$.powerTip.hide = $.powerTip.closeTip;

/**
 * Creates a new CSSCordinate object.
 * @private
 * @constructor
 */
function CSSCordinate() {
	var me = this;

	// initialize object properties
	me.top = 'auto';
	me.left = 'auto';
	me.right = 'auto';

	/**
	 * Set a property to a value.
	 * @private
	 * @param {string} property The name of the property.
	 * @param {number} value The value of the property.
	 */
	me.set = function(property, value) {
		if ($.isNumeric(value)) {
			me[property] = Math.round(value);
		}
	};
}

// Common utility functions

/**
 * Asks the DisplayController for the specified element to show() its tooltip.
 * @private
 * @param {jQuery} el The element that the tooltip should be shown for.
 * @param {boolean=} immediate Skip intent testing (optional).
 * @param {boolean=} forcedOpen Ignore cursor position and force tooltip to open (optional).
 */
function elementShowTip(el, immediate, forcedOpen) {
	$(el).data(DATA_DISPLAYCONTROLLER).show(immediate, forcedOpen);
}

/**
 * Tracks the mouse cursor position specified in the event and attempts to open
 * the tooltip for the specified element.
 * @private
 * @param {jQuery} el The element that the tooltip should be shown for.
 * @param {jQuery.Event} event The event with pageX and pageY info.
 */
function elementShowAndTrack(el, event) {
	trackMouse(event);
	session.previousX = event.pageX;
	session.previousY = event.pageY;
	elementShowTip(el);
}

/**
 * Asks the DisplayController for the specified element to hide() its tooltip.
 * @private
 * @param {jQuery} el The element that the tooltip should be shown for.
 * @param {boolean=} immediate Disable close delay (optional).
 */
function elementHideTip(el, immediate) {
	$(el).data(DATA_DISPLAYCONTROLLER).hide(immediate);
}
