$(function() {
	'use strict';

	QUnit.module('PowerTip Core');

	QUnit.test('powerTip defined', function(assert) {
		var element = $('<a href="#" title="This is the tooltip text"></a>');
		assert.strictEqual(typeof element.powerTip, 'function', 'powerTip is defined');
	});

	QUnit.test('expose default settings', function(assert) {
		assert.ok($.fn.powerTip.defaults, 'defaults is defined');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('fadeInTime'), 'fadeInTime exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('fadeOutTime'), 'fadeOutTime exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('followMouse'), 'followMouse exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('popupId'), 'popupId exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('intentSensitivity'), 'intentSensitivity exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('intentPollInterval'), 'intentPollInterval exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('closeDelay'), 'closeDelay exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('placement'), 'placement exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('smartPlacement'), 'smartPlacement exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('offset'), 'offset exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('mouseOnToPopup'), 'mouseOnToPopup exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('manual'), 'manual exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('openEvents'), 'openEvents exists');
		assert.ok($.fn.powerTip.defaults.hasOwnProperty('closeEvents'), 'closeEvents exists');
	});

	QUnit.test('expose smart placement lists', function(assert) {
		assert.ok($.fn.powerTip.smartPlacementLists, 'smartPlacementLists is defined');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('n'), 'n exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('e'), 'e exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('s'), 's exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('w'), 'w exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('ne'), 'ne exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('nw'), 'nw exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('se'), 'se exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('sw'), 'sw exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('ne-alt'), 'ne-alt exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('nw-alt'), 'nw-alt exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('se-alt'), 'se-alt exists');
		assert.ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('sw-alt'), 'sw-alt exists');
	});

	QUnit.test('powerTip', function(assert) {
		var div = $('<div />'),
			empty = $('#thisDoesntExist'),
			element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();

		assert.deepEqual(div.powerTip(), div, 'original jQuery object returned for matched selector');
		assert.deepEqual(empty.powerTip(), empty, 'original jQuery object returned for empty selector');
		assert.deepEqual(div.powerTip('show'), div, 'original jQuery object returned for show');
		assert.deepEqual(div.powerTip('hide', true), div, 'original jQuery object returned for hide');
		assert.deepEqual(div.powerTip('toggle'), div, 'original jQuery object returned for toggle');
		assert.deepEqual(div.powerTip('resetPosition'), div, 'original jQuery object returned for resetPosition');
		assert.deepEqual(div.powerTip('destroy'), div, 'original jQuery object returned for destroy');
		assert.notOk(element.attr('title'), 'title attribute was removed');
		assert.ok(element.data(DATA_DISPLAYCONTROLLER), 'new DisplayController created and added to data');
	});

	QUnit.test('powerTip hooks events', function(assert) {
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
			element.triggerHandler(eventName);
			assert.strictEqual(showTriggered, true, eventName + ' event calls DisplayController.show');
		});

		// test close events
		$.each(closeEvents, function(idx, eventName) {
			hideTriggered = false;
			element.triggerHandler(eventName);
			assert.strictEqual(hideTriggered, true, eventName + ' event calls DisplayController.hide');
		});

		// test escape key
		hideTriggered = false;
		element.trigger($.Event('keydown', { keyCode: 27 }));
		assert.strictEqual(hideTriggered, true, 'keydown event for key code 27 calls DisplayController.hide');

		// cleanup test element
		element.remove();
	});

	QUnit.test('expose API', function(assert) {
		assert.strictEqual(typeof $.powerTip.show, 'function', 'show is defined');
		assert.strictEqual(typeof $.powerTip.reposition, 'function', 'reposition is defined');
		assert.strictEqual(typeof $.powerTip.hide, 'function', 'hide is defined');
		assert.strictEqual(typeof $.powerTip.toggle, 'function', 'toggle is defined');
		assert.strictEqual(typeof $.powerTip.destroy, 'function', 'destroy is defined');
		// deprecated
		assert.strictEqual(typeof $.powerTip.showTip, 'function', 'showTip is defined');
		assert.strictEqual(typeof $.powerTip.closeTip, 'function', 'closeTip is defined');
	});

	QUnit.test('API show method should call DisplayController.show', function(assert) {
		var showCalled = false,
			element = $('<span />')
				.data(DATA_DISPLAYCONTROLLER, new MockDisplayController(
					function() {
						showCalled = true;
					}
				));

		$.powerTip.show(element);

		assert.ok(showCalled, 'show method was called');
	});

	QUnit.test('API reposition method should call DisplayController.resetPosition', function(assert) {
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

		assert.ok(resetCalled, 'reposition method was called');
	});

	QUnit.test('API hide method should call DisplayController.hide', function(assert) {
		var hideCalled = false,
			element = $('<span />')
				.data(DATA_DISPLAYCONTROLLER, new MockDisplayController(
					null,
					function() {
						hideCalled = true;
					}
				));

		$.powerTip.hide(element);

		assert.ok(hideCalled, 'hide method was called');
	});

	QUnit.test('API toggle method should call DisplayController.show to open and DisplayController.hide to close', function(assert) {
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

		assert.ok(showCalled, 'show method was called');
		assert.ok(hideCalled, 'hide method was called');

		// reset activeHover
		session.activeHover = null;
	});

	QUnit.test('API destroy method rolls back PowerTip changes', function(assert) {
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
		assert.strictEqual(element.attr('title'), 'This is the tooltip text', 'destory method rolled back the title attribute');
		assert.notOk(element.data(DATA_POWERTIP), 'destroy method removed powertip data attribute');
		assert.strictEqual(elementDataAttr.data(DATA_POWERTIP), 'This is the tooltip text', 'destroy method did not remove manually set powertip data attribute');

		// events
		element.trigger($.Event('mouseenter', { pageX: 10, pageY: 10 }));
		assert.notOk(showTriggered, 'mouseenter event was unhooked after destroy');
		showTriggered = false;

		element.trigger('mouseleave');
		assert.notOk(hideTriggered, 'mouseleave event was unhooked after destroy');
		hideTriggered = false;

		element.trigger('focus');
		assert.notOk(showTriggered, 'focus event was unhooked after destroy');
		showTriggered = false;

		element.trigger('blur');
		assert.notOk(hideTriggered, 'blur event was unhooked after destroy');
		hideTriggered = false;

		element.trigger($.Event('keydown', { keyCode: 27 }));
		assert.notOk(hideTriggered, 'keydown event was unhooked after destroy');
		hideTriggered = false;
	});

	QUnit.test('API destroy method with no arguments rolls back all PowerTip changes', function(assert) {
		// run PowerTip
		$('<a href="#" title="This is the tooltip text"></a>').powerTip();

		// destroy everything
		$.powerTip.destroy();

		// tooltip element
		assert.strictEqual($('#' + $.fn.powerTip.defaults.popupId).length, 0, 'tooltip element removed');

		// document event (mouse tracking)
		session.currentX = 1;
		$(document).trigger($.Event('mousemove', { pageX: 2, pageY: 3 }));
		assert.strictEqual(session.currentX, 1, 'document event removed');
	});

	function MockDisplayController(show, hide, cancel, resetPosition) {
		this.show = show || $.noop;
		this.hide = hide || $.noop;
		this.cancel = cancel || $.noop;
		this.resetPosition = resetPosition || $.noop;
	}
});
