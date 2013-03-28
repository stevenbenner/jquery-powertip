/**
 * PowerTip Core
 *
 * @fileoverview  Core variables, plugin object, and API.
 * @link          http://stevenbenner.github.com/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @requires      jQuery 1.7+
 */

// useful private variables
var $document = $(document),
	$window = $(window),
	$body = $('body');

// constants
var DATA_DISPLAYCONTROLLER = 'displayController',
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
	mouseTrackingActive: false,
	delayInProgress: false,
	windowWidth: 0,
	windowHeight: 0,
	scrollTop: 0,
	scrollLeft: 0
};

/**
 * Collision enumeration
 * @enum {number}
 */
var Collision = {
	none: 0,
	top: 1,
	bottom: 2,
	left: 4,
	right: 8
};

/**
 * Display hover tooltips on the matched elements.
 * @param {(Object|string)} opts The options object to use for the plugin, or
 *     the name of a method to invoke on the first matched element.
 * @param {*=} [arg] Argument for an invoked method (optional).
 * @return {jQuery} jQuery object for the matched selectors.
 */
$.fn.powerTip = function(opts, arg) {
	// don't do any work if there were no matched elements
	if (!this.length) {
		return this;
	}

	// handle api method calls on the plugin, e.g. powerTip('hide')
	if ($.type(opts) === 'string' && $.powerTip[opts]) {
		return $.powerTip[opts].call(this, this, arg);
	}

	// extend options and instantiate TooltipController
	var options = $.extend({}, $.fn.powerTip.defaults, opts),
		tipController = new TooltipController(options);

	// hook mouse and viewport dimension tracking
	initTracking();

	// setup the elements
	this.each(function elementSetup() {
		var $this = $(this),
			dataPowertip = $this.data(DATA_POWERTIP),
			dataElem = $this.data(DATA_POWERTIPJQ),
			dataTarget = $this.data(DATA_POWERTIPTARGET),
			title;

		// handle repeated powerTip calls on the same element by destroying the
		// original instance hooked to it and replacing it with this call
		if ($this.data(DATA_DISPLAYCONTROLLER)) {
			$.powerTip.destroy($this);
		}

		// attempt to use title attribute text if there is no data-powertip,
		// data-powertipjq or data-powertiptarget. If we do use the title
		// attribute, delete the attribute so the browser will not show it
		title = $this.attr('title');
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
				$.powerTip.show(this, event);
			},
			'mouseleave.powertip': function elementMouseLeave() {
				$.powerTip.hide(this);
			},
			// keyboard events
			'focus.powertip': function elementFocus() {
				$.powerTip.show(this);
			},
			'blur.powertip': function elementBlur() {
				$.powerTip.hide(this, true);
			},
			'keydown.powertip': function elementKeyDown(event) {
				// close tooltip when the escape key is pressed
				if (event.keyCode === 27) {
					$.powerTip.hide(this, true);
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
 * The first item in the array is the highest priority, the last is the lowest.
 * The last item is also the default, which will be used if all previous options
 * do not fit.
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
	'nw-alt': ['nw-alt', 'n', 'ne-alt', 'sw-alt', 's', 'se-alt', 'w', 'e'],
	'ne-alt': ['ne-alt', 'n', 'nw-alt', 'se-alt', 's', 'sw-alt', 'e', 'w'],
	'sw-alt': ['sw-alt', 's', 'se-alt', 'nw-alt', 'n', 'ne-alt', 'w', 'e'],
	'se-alt': ['se-alt', 's', 'sw-alt', 'ne-alt', 'n', 'nw-alt', 'e', 'w']
};

/**
 * Public API
 */
$.powerTip = {
	/**
	 * Attempts to show the tooltip for the specified element.
	 * @param {jQuery|Element} element The element to open the tooltip for.
	 * @param {jQuery.Event=} event jQuery event for hover intent and mouse
	 *     tracking (optional).
	 */
	show: function apiShowTip(element, event) {
		if (event) {
			trackMouse(event);
			session.previousX = event.pageX;
			session.previousY = event.pageY;
			$(element).data(DATA_DISPLAYCONTROLLER).show();
		} else {
			$(element).first().data(DATA_DISPLAYCONTROLLER).show(true, true);
		}
		return element;
	},

	/**
	 * Repositions the tooltip on the element.
	 * @param {jQuery|Element} element The element the tooltip is shown for.
	 */
	reposition: function apiResetPosition(element) {
		$(element).first().data(DATA_DISPLAYCONTROLLER).resetPosition();
		return element;
	},

	/**
	 * Attempts to close any open tooltips.
	 * @param {(jQuery|Element)=} element The element with the tooltip that
	 *     should be closed (optional).
	 * @param {boolean=} immediate Disable close delay (optional).
	 */
	hide: function apiCloseTip(element, immediate) {
		if (element) {
			$(element).first().data(DATA_DISPLAYCONTROLLER).hide(immediate);
		} else {
			if (session.activeHover) {
				session.activeHover.data(DATA_DISPLAYCONTROLLER).hide(true);
			}
		}
		return element;
	},

	/**
	 * Destroy and roll back any powerTip() instance on the specified element.
	 * @param {jQuery|Element} element The element with the powerTip instance.
	 */
	destroy: function apiDestroy(element) {
		$(element).off('.powertip').each(function destroy() {
			var $this = $(this),
				dataAttributes = [
					DATA_ORIGINALTITLE,
					DATA_DISPLAYCONTROLLER,
					DATA_HASACTIVEHOVER,
					DATA_FORCEDOPEN
				];

			if ($this.data(DATA_ORIGINALTITLE)) {
				$this.attr('title', $this.data(DATA_ORIGINALTITLE));
				dataAttributes.push(DATA_POWERTIP);
			}

			$this.removeData(dataAttributes);
		});
		return element;
	}
};

// API aliasing
$.powerTip.showTip = $.powerTip.show;
$.powerTip.closeTip = $.powerTip.hide;
