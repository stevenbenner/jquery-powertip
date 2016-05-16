$(function() {
	'use strict';

	QUnit.module('Display Controller');

	QUnit.test('expose methods', function(assert) {
		var dc = new DisplayController();
		assert.strictEqual(typeof dc.show, 'function', 'show method is defined');
		assert.strictEqual(typeof dc.hide, 'function', 'hide method is defined');
		assert.strictEqual(typeof dc.cancel, 'function', 'cances method is defined');
		assert.strictEqual(typeof dc.resetPosition, 'function', 'resetPosition method is defined');
	});

	QUnit.test('show method calls TooltipController.showTip', function(assert) {
		var done = assert.async(),
			element = $('<span />'),
			dc;

		assert.expect(1);

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				function(el) {
					assert.deepEqual(el, element, 'original element passed');
					done();
				}
			)
		);

		dc.show();
	});

	QUnit.test('hide method calls TooltipController.hideTip', function(assert) {
		var done = assert.async(),
			element = $('<span />'),
			dc;

		assert.expect(1);

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				null,
				function(el) {
					assert.deepEqual(el, element, 'original element passed');
					done();
				}
			)
		);

		element.data(DATA_HASACTIVEHOVER, true); // set active hover or hide wont do anything
		dc.hide();
	});

	QUnit.test('resetPosition method calls TooltipController.resetPosition', function(assert) {
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

		assert.ok(resetCalled, 'resetPosition method called');
	});

	QUnit.test('show method does not delay when immediate is set to true', function(assert) {
		var element = $('<span />'),
			showCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				function(el) {
					showCalled = true;
					assert.deepEqual(el, element, 'original element passed');
				}
			)
		);

		dc.show(true);

		assert.ok(showCalled, 'showTip called');
	});

	QUnit.test('hide method does not delay when disableDelay is set to true', function(assert) {
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
					assert.deepEqual(el, element, 'original element passed');
				}
			)
		);

		element.data(DATA_HASACTIVEHOVER, true); // set active hover or hide wont do anything
		dc.hide(true);

		assert.ok(hideCalled, 'hideTip called');
	});

	QUnit.test('cancel method stops showTip from being called', function(assert) {
		var done = assert.async(),
			element = $('<span />'),
			showCalled = false,
			dc;

		assert.expect(1);

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
				assert.notOk(showCalled, 'showTip was not called');
				done();
			}, $.fn.powerTip.defaults.intentPollInterval / 2 + 10);
		}, $.fn.powerTip.defaults.intentPollInterval / 2);
	});

	QUnit.test('cancel method stops hideTip from being called', function(assert) {
		var done = assert.async(),
			element = $('<span />'),
			hideCalled = false,
			dc;

		assert.expect(1);

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
				assert.notOk(hideCalled, 'showTip was not called');
				done();
			}, $.fn.powerTip.defaults.closeDelay / 2 + 10);
		}, $.fn.powerTip.defaults.closeDelay / 2);
	});

	QUnit.test('show method does not call showTip if hover intent is never satisfied', function(assert) {
		var done = assert.async(),
			element = $('<span />'),
			showCalled = false,
			testCount = 5,
			dc,
			changeMousePosition;

		assert.expect(testCount);

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
				assert.strictEqual(showCalled, false, 'showTip has not been called');
				session.currentX += $.fn.powerTip.defaults.intentSensitivity;
				session.currentY += $.fn.powerTip.defaults.intentSensitivity;
				setTimeout(changeMousePosition, $.fn.powerTip.defaults.intentPollInterval);
			} else {
				// we're done testing
				done();
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
