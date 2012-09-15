/**
 * PowerTip Core
 *
 * @fileoverview  Core variables, plugin object, and API.
 * @link          http://stevenbenner.github.com/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @version       1.1.0
 * @requires      jQuery 1.7+
 */

// useful private variables
var $document = $(document),
	$window = $(window),
	$body = $('body'),
	RAD2DEG = 180 / Math.PI;

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

	// destroy associated powertips
	if (opts === 'destroy') {
		return this.off('.powertip').each(function destroy() {
			var $this = $(this);

			if ($this.data('originalTitle')) {
				$this.attr('title', $this.data('originalTitle'));
			}

			$this.removeData([
				'originalTitle',
				'displayController',
				'hasActiveHover',
				'forcedOpen'
			]);
		});
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
			$this.data({powertip: title, originalTitle: title}).removeAttr('title');
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
		'mouseenter.powertip': function elementMouseEnter(event) {
			trackMouse(event);
			session.previousX = event.pageX;
			session.previousY = event.pageY;
			$(this).data('displayController').show();
		},
		'mouseleave.powertip': function elementMouseLeave() {
			$(this).data('displayController').hide();
		},

		// keyboard events
		'focus.powertip': function elementFocus() {
			$(this).data('displayController').show(true);
		},
		'blur.powertip': function elementBlur() {
			$(this).data('displayController').hide(true);
		},
		'keydown.powertip': function elementKeyDown(event) {
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
	se: ['se', 'e', 'ne', 's', 'n', 'nw', 'se'],
	'nw-alt': ['nw-alt', 'n', 'ne-alt', 'nw', 'ne', 'w', 'sw-alt', 's', 'se-alt', 'sw', 'se', 'e'],
	'ne-alt': ['ne-alt', 'n', 'nw-alt', 'ne', 'nw', 'e', 'se-alt', 's', 'sw-alt', 'se', 'sw', 'w'],
	'sw-alt': ['sw-alt', 's', 'se-alt', 'sw', 'se', 'w', 'nw-alt', 'n', 'ne-alt', 'nw', 'ne', 'e'],
	'se-alt': ['se-alt', 's', 'sw-alt', 'se', 'sw', 'e', 'ne-alt', 'n', 'nw-alt', 'ne', 'nw', 'w']
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
	 * Repositions the tooltip on the element.
	 * @public
	 * @param {Object} element The element that the tooltip is shown for.
	 */
	resetPosition: function resetPosition(element) {
		element = element.first();
		element.data('displayController').resetPosition();
	},

	/**
	 * Attempts to close any open tooltips.
	 * @public
	 */
	closeTip: function apiCloseTip() {
		$document.triggerHandler('closePowerTip');
	}

};
