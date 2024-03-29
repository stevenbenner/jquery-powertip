/**
 * PowerTip Core
 *
 * @fileoverview  Core variables, plugin object, and API.
 * @link          https://stevenbenner.github.io/jquery-powertip/
 * @author        Steven Benner (https://stevenbenner.com/)
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
	EVENT_NAMESPACE = '.powertip',
	RAD2DEG = 180 / Math.PI,
	MOUSE_EVENTS = [
		'click',
		'dblclick',
		'mousedown',
		'mouseup',
		'mousemove',
		'mouseover',
		'mouseout',
		'mouseenter',
		'mouseleave',
		'contextmenu'
	];

/**
 * Session data
 * Private properties global to all powerTip instances
 */
var session = {
	elements: [],
	tooltips: null,
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
	closeDelayTimeout: null,
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
 * @param {(Object|string)=} opts The options object to use for the plugin, or
 *     the name of a method to invoke on the first matched element.
 * @param {*=} [arg] Argument for an invoked method (optional).
 * @return {jQuery} jQuery object for the matched selectors.
 */
$.fn.powerTip = function(opts, arg) {
	var targetElements = this,
		options,
		tipController;

	// don't do any work if there were no matched elements
	if (!targetElements.length) {
		return targetElements;
	}

	// handle api method calls on the plugin, e.g. powerTip('hide')
	if (typeof opts === 'string' && $.powerTip[opts]) {
		return $.powerTip[opts].call(targetElements, targetElements, arg);
	}

	// extend options
	options = $.extend({}, $.fn.powerTip.defaults, opts);

	// handle repeated powerTip calls on the same element by destroying any
	// original instance hooked to it and replacing it with this call
	$.powerTip.destroy(targetElements);

	// instantiate the TooltipController for this instance
	tipController = new TooltipController(options);

	// hook mouse and viewport dimension tracking
	initTracking();

	// setup the elements
	targetElements.each(function elementSetup() {
		var $this = $(this),
			dataPowertip = $this.data(DATA_POWERTIP),
			dataElem = $this.data(DATA_POWERTIPJQ),
			dataTarget = $this.data(DATA_POWERTIPTARGET),
			title = $this.attr('title');

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

	// attach events to matched elements if the manual option is not enabled
	if (!options.manual) {
		// attach open events
		$.each(options.openEvents, function(idx, evt) {
			if ($.inArray(evt, options.closeEvents) > -1) {
				// event is in both openEvents and closeEvents, so toggle it
				targetElements.on(evt + EVENT_NAMESPACE, function elementToggle(event) {
					$.powerTip.toggle(this, event);
				});
			} else {
				targetElements.on(evt + EVENT_NAMESPACE, function elementOpen(event) {
					$.powerTip.show(this, event);
				});
			}
		});

		// attach close events
		$.each(options.closeEvents, function(idx, evt) {
			if ($.inArray(evt, options.openEvents) < 0) {
				targetElements.on(evt + EVENT_NAMESPACE, function elementClose(event) {
					// set immediate to true for any event without mouse info
					$.powerTip.hide(this, !isMouseEvent(event));
				});
			}
		});

		// attach escape key close event
		targetElements.on('keydown' + EVENT_NAMESPACE, function elementKeyDown(event) {
			// always close tooltip when the escape key is pressed
			if (event.keyCode === 27) {
				$.powerTip.hide(this, true);
			}
		});
	}

	// remember elements that the plugin is attached to
	session.elements.push(targetElements);

	return targetElements;
};

/**
 * Default options for the powerTip plugin.
 */
$.fn.powerTip.defaults = {
	fadeInTime: 200,
	fadeOutTime: 100,
	followMouse: false,
	popupId: 'powerTip',
	popupClass: null,
	intentSensitivity: 7,
	intentPollInterval: 100,
	closeDelay: 100,
	placement: 'n',
	smartPlacement: false,
	offset: 10,
	mouseOnToPopup: false,
	manual: false,
	openEvents: [ 'mouseenter', 'focus' ],
	closeEvents: [ 'mouseleave', 'blur' ]
};

/**
 * Default smart placement priority lists.
 * The first item in the array is the highest priority, the last is the lowest.
 * The last item is also the default, which will be used if all previous options
 * do not fit.
 */
$.fn.powerTip.smartPlacementLists = {
	n: [ 'n', 'ne', 'nw', 's' ],
	e: [ 'e', 'ne', 'se', 'w', 'nw', 'sw', 'n', 's', 'e' ],
	s: [ 's', 'se', 'sw', 'n' ],
	w: [ 'w', 'nw', 'sw', 'e', 'ne', 'se', 'n', 's', 'w' ],
	nw: [ 'nw', 'w', 'sw', 'n', 's', 'se', 'nw' ],
	ne: [ 'ne', 'e', 'se', 'n', 's', 'sw', 'ne' ],
	sw: [ 'sw', 'w', 'nw', 's', 'n', 'ne', 'sw' ],
	se: [ 'se', 'e', 'ne', 's', 'n', 'nw', 'se' ],
	'nw-alt': [ 'nw-alt', 'n', 'ne-alt', 'sw-alt', 's', 'se-alt', 'w', 'e' ],
	'ne-alt': [ 'ne-alt', 'n', 'nw-alt', 'se-alt', 's', 'sw-alt', 'e', 'w' ],
	'sw-alt': [ 'sw-alt', 's', 'se-alt', 'nw-alt', 'n', 'ne-alt', 'w', 'e' ],
	'se-alt': [ 'se-alt', 's', 'sw-alt', 'ne-alt', 'n', 'nw-alt', 'e', 'w' ]
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
	 * @return {jQuery|Element} The original jQuery object or DOM Element.
	 */
	show: function apiShowTip(element, event) {
		// if we were given a mouse event then run the hover intent testing,
		// otherwise, simply show the tooltip asap
		if (isMouseEvent(event)) {
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
	 * @return {jQuery|Element} The original jQuery object or DOM Element.
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
	 * @return {jQuery|Element|undefined} The original jQuery object or DOM
	 *     Element, if one was specified.
	 */
	hide: function apiCloseTip(element, immediate) {
		var displayController;

		// set immediate to true when no element is specified
		immediate = element ? immediate : true;

		// find the relevant display controller
		if (element) {
			displayController = $(element).first().data(DATA_DISPLAYCONTROLLER);
		} else if (session.activeHover) {
			displayController = session.activeHover.data(DATA_DISPLAYCONTROLLER);
		}

		// if found, hide the tip
		if (displayController) {
			displayController.hide(immediate);
		}

		return element;
	},

	/**
	 * Toggles the tooltip for the specified element. This will open a closed
	 * tooltip, or close an open tooltip.
	 * @param {jQuery|Element} element The element with the tooltip that
	 *     should be toggled.
	 * @param {jQuery.Event=} event jQuery event for hover intent and mouse
	 *     tracking (optional).
	 * @return {jQuery|Element} The original jQuery object or DOM Element.
	 */
	toggle: function apiToggle(element, event) {
		if (session.activeHover && session.activeHover.is(element)) {
			// tooltip for element is active, so close it
			$.powerTip.hide(element, !isMouseEvent(event));
		} else {
			// tooltip for element is not active, so open it
			$.powerTip.show(element, event);
		}
		return element;
	},

	/**
	 * Destroy and roll back any powerTip() instance on the specified elements.
	 * If no elements are specified then all elements that the plugin is
	 * currently attached to will be rolled back.
	 * @param {(jQuery|Element)=} element The element with the powerTip instance.
	 * @return {jQuery|Element|undefined} The original jQuery object or DOM
	 *     Element, if one was specified.
	 */
	destroy: function apiDestroy(element) {
		var $element,
			foundPowerTip = false,
			runTipCheck = true,
			i;

		// if the plugin is not hooked to any elements then there is no point
		// trying to destroy anything, or dealing with the possible errors
		if (session.elements.length === 0) {
			return element;
		}

		if (element) {
			// make sure we're working with a jQuery object
			$element = $(element);
		} else {
			// if we are being asked to destroy all instances, then iterate the
			// array of jQuery objects that we've been tracking and call destroy
			// for each group
			$.each(session.elements, function cleanElsTracking(idx, els) {
				$.powerTip.destroy(els);
			});

			// reset elements list
			// if a dev calls .remove() on an element before calling this
			// destroy() method then jQuery will have deleted all of the .data()
			// information, so it will not be recognized as a PowerTip element,
			// which could leave dangling references in this array - causing
			// future destroy() (no param) invocations to not fully clean up -
			// so make sure the array is empty and set a flag to skip the
			// element check before proceeding
			session.elements = [];
			runTipCheck = false;

			// set $element to an empty jQuery object to proceed
			$element = $();
		}

		// check if PowerTip has been set on any of the elements - if PowerTip
		// has not been found then return early to skip the slow .not()
		// operation below - only if we did not reset the elements list above
		if (runTipCheck) {
			$element.each(function checkForPowerTip() {
				var $this = $(this);
				if ($this.data(DATA_DISPLAYCONTROLLER)) {
					foundPowerTip = true;
					return false;
				}
				return true;
			});
			if (!foundPowerTip) {
				return element;
			}
		}

		// if a tooltip is currently open for an element we are being asked to
		// destroy then it should be forced to close
		if (session.isTipOpen && !session.isClosing && $element.filter(session.activeHover).length > 0) {
			// if the tooltip is waiting to close then cancel that delay timer
			if (session.delayInProgress) {
				session.activeHover.data(DATA_DISPLAYCONTROLLER).cancel();
			}
			// hide the tooltip, immediately
			$.powerTip.hide(session.activeHover, true);
		}

		// unhook events and destroy plugin changes to each element
		$element.off(EVENT_NAMESPACE).each(function destroy() {
			var $this = $(this),
				dataAttributes = [
					DATA_ORIGINALTITLE,
					DATA_DISPLAYCONTROLLER,
					DATA_HASACTIVEHOVER,
					DATA_FORCEDOPEN
				];

			// revert title attribute
			if ($this.data(DATA_ORIGINALTITLE)) {
				$this.attr('title', $this.data(DATA_ORIGINALTITLE));
				dataAttributes.push(DATA_POWERTIP);
			}

			// remove data attributes
			$this.removeData(dataAttributes);
		});

		// remove destroyed element from active elements collection
		for (i = session.elements.length - 1; i >= 0; i--) {
			session.elements[i] = session.elements[i].not($element);

			// check if there are any more elements left in this collection, if
			// there is not then remove it from the elements array
			if (session.elements[i].length === 0) {
				session.elements.splice(i, 1);
			}
		}

		// if there are no active elements left then we will unhook all of the
		// events that we've bound code to and remove the tooltip elements
		if (session.elements.length === 0) {
			$window.off(EVENT_NAMESPACE);
			$document.off(EVENT_NAMESPACE);
			session.mouseTrackingActive = false;
			if (session.tooltips) {
				session.tooltips.remove();
				session.tooltips = null;
			}
		}

		return element;
	}
};

// API aliasing
// for backwards compatibility with versions earlier than 1.2.0
$.powerTip.showTip = $.powerTip.show;
$.powerTip.closeTip = $.powerTip.hide;
