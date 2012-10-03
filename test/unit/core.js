/*global
	DATA_DISPLAYCONTROLLER:true*/
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
		ok($.fn.powerTip.defaults.hasOwnProperty('placement'), 'placement exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('smartPlacement'), 'smartPlacement exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('offset'), 'offset exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('mouseOnToPopup'), 'mouseOnToPopup exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('manual'), 'manual exists');
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
			element = $('<a href="#" title="This is the tooltip text"></a>').powerTip(),
			showTriggered = false,
			hideTriggered = false;

		// basic tests
		deepEqual(div.powerTip(), div, 'original jQuery object returned for matched selector');
		deepEqual(empty.powerTip(), empty, 'original jQuery object returned for empty selector');
		deepEqual(div.powerTip('show'), div, 'original jQuery object returned for show');
		deepEqual(div.powerTip('hide'), div, 'original jQuery object returned for hide');
		deepEqual(div.powerTip('resetPosition'), div, 'original jQuery object returned for resetPosition');
		deepEqual(div.powerTip('destroy'), div, 'original jQuery object returned for destroy');
		ok(!element.attr('title'), 'title attribute was removed');
		ok(element.data(DATA_DISPLAYCONTROLLER), 'new DisplayController created and added to data');

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

		// event tests
		element.trigger($.Event('mouseenter', { pageX: 10, pageY: 10 }));
		ok(showTriggered, 'mouseenter event calls DisplayController.show');
		showTriggered = false;

		element.trigger('mouseleave');
		ok(hideTriggered, 'mouseleave event calls DisplayController.hide');
		hideTriggered = false;

		element.trigger('focus');
		ok(showTriggered, 'focus event calls DisplayController.show');
		showTriggered = false;

		element.trigger('blur');
		ok(hideTriggered, 'blur event calls DisplayController.hide');
		hideTriggered = false;

		element.trigger($.Event('keydown', { keyCode: 27 }));
		ok(hideTriggered, 'keydown event for key code 27 calls DisplayController.hide');
		hideTriggered = false;

		// destroy tests
		element.powerTip('destroy');
		strictEqual(element.attr('title'), 'This is the tooltip text', 'destory method rolled back the title attribute');

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

		element.trigger($.Event('keydown', {keyCode: 27}));
		ok(!hideTriggered, 'keydown event was unhooked after destroy');
		hideTriggered = false;
	});

	test('expose API', function() {
		strictEqual(typeof $.powerTip.showTip, 'function', 'showTip is defined');
		strictEqual(typeof $.powerTip.resetPosition, 'function', 'resetPosition is defined');
		strictEqual(typeof $.powerTip.closeTip, 'function', 'closeTip is defined');
		strictEqual(typeof $.powerTip.destroy, 'function', 'destroy is defined');
	});

	test('API showTip method should call DisplayController.show', function() {
		var showCalled = false,
			element = $('<span />')
				.data(DATA_DISPLAYCONTROLLER, new MockDisplayController(
					function() {
						showCalled = true;
					}
				));

		$.powerTip.showTip(element);

		ok(showCalled, 'show method was called');
	});

	test('API resetPosition method should call DisplayController.resetPosition', function() {
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

		$.powerTip.resetPosition(element);

		ok(resetCalled, 'resetPosition method was called');
	});

	test('API closeTip method should call DisplayController.hide', function() {
		var hideCalled = false,
			element = $('<span />')
				.data(DATA_DISPLAYCONTROLLER, new MockDisplayController(
					null,
					function() {
						hideCalled = true;
					}
				));

		$.powerTip.closeTip(element);

		ok(hideCalled, 'hide method was called');
	});

	function MockDisplayController(show, hide, cancel, resetPosition) {
		this.show = show || $.noop;
		this.hide = hide || $.noop;
		this.cancel = cancel || $.noop;
		this.resetPosition = resetPosition || $.noop;
	}

});
