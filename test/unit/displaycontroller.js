$(function() {
	'use strict';

	module('Display Controller');

	test('expose methods', function() {
		var dc = new DisplayController();
		strictEqual(typeof dc.show, 'function', 'show method is defined');
		strictEqual(typeof dc.hide, 'function', 'hide method is defined');
		strictEqual(typeof dc.cancel, 'function', 'cances method is defined');
		strictEqual(typeof dc.resetPosition, 'function', 'resetPosition method is defined');
	});

	asyncTest('show method calls TooltipController.showTip', function() {
		var element = $('<span />'),
			dc;

		expect(1);

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				function(el) {
					deepEqual(el, element, 'original element passed');
					start();
				}
			)
		);

		dc.show();
	});

	asyncTest('hide method calls TooltipController.hideTip', function() {
		var element = $('<span />'),
			dc;

		expect(1);

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				null,
				function(el) {
					deepEqual(el, element, 'original element passed');
					start();
				}
			)
		);

		element.data(DATA_HASACTIVEHOVER, true); // set active hover or hide wont do anything
		dc.hide();
	});

	test('resetPosition method calls TooltipController.resetPosition', function() {
		var element = $('<span />'),
			resetCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				null,
				null,
				function() {
					resetCalled = true;
				}
			)
		);

		dc.resetPosition();

		ok(resetCalled, 'resetPosition method called');
	});

	test('show method does not delay when immediate is set to true', function() {
		var element = $('<span />'),
			showCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				function(el) {
					showCalled = true;
					deepEqual(el, element, 'original element passed');
				}
			)
		);

		dc.show(true);

		ok(showCalled, 'showTip called');
	});

	test('hide method does not delay when disableDelay is set to true', function() {
		var element = $('<span />'),
			hideCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				null,
				function(el) {
					hideCalled = true;
					deepEqual(el, element, 'original element passed');
				}
			)
		);

		element.data(DATA_HASACTIVEHOVER, true); // set active hover or hide wont do anything
		dc.hide(true);

		ok(hideCalled, 'hideTip called');
	});

	asyncTest('cancel method stops showTip from being called', function(){
		var element = $('<span />'),
			showCalled = false,
			dc;

		expect(1);

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				function() {
					showCalled = true;
				}
			)
		);

		dc.show();

		setTimeout(function() {
			dc.cancel();

			setTimeout(function() {
				ok(!showCalled, 'showTip was not called');
				start();
			}, $.fn.powerTip.defaults.intentPollInterval / 2 + 10);
		}, $.fn.powerTip.defaults.intentPollInterval / 2);
	});

	asyncTest('cancel method stops hideTip from being called', function(){
		var element = $('<span />'),
			hideCalled = false,
			dc;

		expect(1);

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				null,
				function() {
					hideCalled = true;
				}
			)
		);

		element.data(DATA_HASACTIVEHOVER, true); // set active hover or hide wont do anything
		dc.hide();

		setTimeout(function() {
			dc.cancel();

			setTimeout(function() {
				ok(!hideCalled, 'showTip was not called');
				start();
			}, $.fn.powerTip.defaults.closeDelay / 2 + 10);
		}, $.fn.powerTip.defaults.closeDelay / 2);
	});

	asyncTest('show method does not call showTip if hover intent is never satisfied', function() {
		var element = $('<span />'),
			showCalled = false,
			testCount = 5,
			dc,
			changeMousePosition;

		expect(testCount);

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				function() {
					showCalled = true;
				}
			)
		);

		changeMousePosition = function() {
			if (testCount-- > 0) {
				// check value, move the mouse cursor, and run the test again
				strictEqual(showCalled, false, 'showTip has not been called');
				session.currentX += $.fn.powerTip.defaults.intentSensitivity;
				session.currentY += $.fn.powerTip.defaults.intentSensitivity;
				setTimeout(changeMousePosition, $.fn.powerTip.defaults.intentPollInterval);
			} else {
				// we're done testing
				start();
			}
		};

		dc.show();
		changeMousePosition();
	});

	function MockTipController(show, hide, reset) {
		this.showTip = show || $.noop;
		this.hideTip = hide || $.noop;
		this.resetPosition = reset || $.noop;
	}

});
