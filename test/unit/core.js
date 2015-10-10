$(function() {
	'use strict';

	module('PowerTip Core');

	test('powerTip defined', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>');
		strictEqual(typeof element.powerTip, 'function', 'powerTip is defined');
	});

	test('expose default settings', function() {
		ok($.fn.powerTip.defaults, 'defaults is defined');
		ok($.fn.powerTip.defaults.hasOwnProperty('fadeInTime'), 'fadeInTime exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('fadeOutTime'), 'fadeOutTime exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('followMouse'), 'followMouse exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('popupId'), 'popupId exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('intentSensitivity'), 'intentSensitivity exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('intentPollInterval'), 'intentPollInterval exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('closeDelay'), 'closeDelay exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('openDelay'), 'openDelay exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('placement'), 'placement exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('smartPlacement'), 'smartPlacement exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('offset'), 'offset exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('mouseOnToPopup'), 'mouseOnToPopup exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('manual'), 'manual exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('openEvents'), 'openEvents exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('closeEvents'), 'closeEvents exists');
	});

	test('expose smart placement lists', function() {
		ok($.fn.powerTip.smartPlacementLists, 'smartPlacementLists is defined');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('n'), 'n exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('e'), 'e exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('s'), 's exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('w'), 'w exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('ne'), 'ne exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('nw'), 'nw exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('se'), 'se exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('sw'), 'sw exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('ne-alt'), 'ne-alt exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('nw-alt'), 'nw-alt exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('se-alt'), 'se-alt exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('sw-alt'), 'sw-alt exists');
	});

	test('powerTip', function() {
		var div = $('<div />'),
			empty = $('#thisDoesntExist'),
			element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();

		deepEqual(div.powerTip(), div, 'original jQuery object returned for matched selector');
		deepEqual(empty.powerTip(), empty, 'original jQuery object returned for empty selector');
		deepEqual(div.powerTip('show'), div, 'original jQuery object returned for show');
		deepEqual(div.powerTip('hide', true), div, 'original jQuery object returned for hide');
		deepEqual(div.powerTip('toggle'), div, 'original jQuery object returned for toggle');
		deepEqual(div.powerTip('resetPosition'), div, 'original jQuery object returned for resetPosition');
		deepEqual(div.powerTip('destroy'), div, 'original jQuery object returned for destroy');
		ok(!element.attr('title'), 'title attribute was removed');
		ok(element.data(DATA_DISPLAYCONTROLLER), 'new DisplayController created and added to data');
	});

	test('powerTip hooks events', function() {
		var openEvents = [ 'mouseenter', 'focus', 'customOpenEvent' ],
			closeEvents = [ 'mouseleave', 'blur', 'customCloseEvent' ],
			element = $('<a href="#" title="This is the tooltip text">TEXT</a>').powerTip({
				openEvents: openEvents,
				closeEvents: closeEvents
			}),
			showTriggered = false,
			hideTriggered = false;

		element.data(
			DATA_DISPLAYCONTROLLER,
			new MockDisplayController(
				function() {
					showTriggered = true;
				},
				function() {
					hideTriggered = true;
				}
			)
		);

		// jquery 1.9 will not trigger a focus event on an element that cannot
		// be focused, so we have to append the test element to the document
		// before the focus test will work
		$('body').prepend(element);

		// test open events
		$.each(openEvents, function(idx, eventName) {
			showTriggered = false;
			element.trigger(eventName);
			strictEqual(showTriggered, true, eventName + ' event calls DisplayController.show');
		});

		// test close events
		$.each(closeEvents, function(idx, eventName) {
			hideTriggered = false;
			element.trigger('mouseleave');
			strictEqual(hideTriggered, true, eventName + ' event calls DisplayController.hide');
		});

		// test escape key
		hideTriggered = false;
		element.trigger($.Event('keydown', { keyCode: 27 }));
		strictEqual(hideTriggered, true, 'keydown event for key code 27 calls DisplayController.hide');

		// cleanup test element
		element.remove();
	});

	test('expose API', function() {
		strictEqual(typeof $.powerTip.show, 'function', 'show is defined');
		strictEqual(typeof $.powerTip.reposition, 'function', 'reposition is defined');
		strictEqual(typeof $.powerTip.hide, 'function', 'hide is defined');
		strictEqual(typeof $.powerTip.toggle, 'function', 'toggle is defined');
		strictEqual(typeof $.powerTip.destroy, 'function', 'destroy is defined');
		// deprecated
		strictEqual(typeof $.powerTip.showTip, 'function', 'showTip is defined');
		strictEqual(typeof $.powerTip.closeTip, 'function', 'closeTip is defined');
	});

	test('API show method should call DisplayController.show', function() {
		var showCalled = false,
			element = $('<span />')
				.data(DATA_DISPLAYCONTROLLER, new MockDisplayController(
					function() {
						showCalled = true;
					}
				));

		$.powerTip.show(element);

		ok(showCalled, 'show method was called');
	});

	test('API reposition method should call DisplayController.resetPosition', function() {
		var resetCalled = false,
			element = $('<span />')
				.data(DATA_DISPLAYCONTROLLER, new MockDisplayController(
					null,
					null,
					null,
					function() {
						resetCalled = true;
					}
				));

		$.powerTip.reposition(element);

		ok(resetCalled, 'reposition method was called');
	});

	test('API hide method should call DisplayController.hide', function() {
		var hideCalled = false,
			element = $('<span />')
				.data(DATA_DISPLAYCONTROLLER, new MockDisplayController(
					null,
					function() {
						hideCalled = true;
					}
				));

		$.powerTip.hide(element);

		ok(hideCalled, 'hide method was called');
	});

	test('API toggle method should call DisplayController.show to open and DisplayController.hide to close', function() {
		var showCalled = false,
			hideCalled = false,
			element = $('<span />')
				.data(DATA_DISPLAYCONTROLLER, new MockDisplayController(
					function() {
						showCalled = true;
						// toggle checks activeHover to determine action
						session.activeHover = element;
					},
					function() {
						hideCalled = true;
					}
				));

		$.powerTip.toggle(element); // simulate show
		$.powerTip.toggle(element); // simulate hide

		ok(showCalled, 'show method was called');
		ok(hideCalled, 'hide method was called');

		// reset activeHover
		session.activeHover = null;
	});

	test('API destroy method rolls back PowerTip changes', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>').powerTip(),
			elementDataAttr = $('<a href="#" data-powertip="This is the tooltip text"></a>').powerTip(),
			showTriggered = false,
			hideTriggered = false;

		element.data(
			DATA_DISPLAYCONTROLLER,
			new MockDisplayController(
				function() {
					showTriggered = true;
				},
				function() {
					hideTriggered = true;
				}
			)
		);

		element.powerTip('destroy');
		elementDataAttr.powerTip('destroy');

		// attributes
		strictEqual(element.attr('title'), 'This is the tooltip text', 'destory method rolled back the title attribute');
		ok(!element.data(DATA_POWERTIP), 'destroy method removed powertip data attribute');
		strictEqual(elementDataAttr.data(DATA_POWERTIP), 'This is the tooltip text', 'destroy method did not remove manually set powertip data attribute');

		// events
		element.trigger($.Event('mouseenter', { pageX: 10, pageY: 10 }));
		ok(!showTriggered, 'mouseenter event was unhooked after destroy');
		showTriggered = false;

		element.trigger('mouseleave');
		ok(!hideTriggered, 'mouseleave event was unhooked after destroy');
		hideTriggered = false;

		element.trigger('focus');
		ok(!showTriggered, 'focus event was unhooked after destroy');
		showTriggered = false;

		element.trigger('blur');
		ok(!hideTriggered, 'blur event was unhooked after destroy');
		hideTriggered = false;

		element.trigger($.Event('keydown', { keyCode: 27 }));
		ok(!hideTriggered, 'keydown event was unhooked after destroy');
		hideTriggered = false;
	});

	test('API destroy method with no arguments rolls back all PowerTip changes', function() {
		// run PowerTip
		$('<a href="#" title="This is the tooltip text"></a>').powerTip();

		// destroy everything
		$.powerTip.destroy();

		// tooltip element
		strictEqual($('#' + $.fn.powerTip.defaults.popupId).length, 0, 'tooltip element removed');

		// document event (mouse tracking)
		session.currentX = 1;
		$(document).trigger($.Event('mousemove', { pageX: 2, pageY: 3 }));
		strictEqual(session.currentX, 1, 'document event removed');
	});

	function MockDisplayController(show, hide, cancel, resetPosition) {
		this.show = show || $.noop;
		this.hide = hide || $.noop;
		this.cancel = cancel || $.noop;
		this.resetPosition = resetPosition || $.noop;
	}
});
