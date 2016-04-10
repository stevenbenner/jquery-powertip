$(function() {
	'use strict';

	// set of default options with zero fade time for faster testing
	var zeroTimeOpts = $.extend({}, $.fn.powerTip.defaults, { fadeInTime: 0, fadeOutTime: 0 });

	QUnit.module('Tooltip Controller');

	QUnit.test('expose methods', function(assert) {
		var tc = new TooltipController($.fn.powerTip.defaults);
		assert.strictEqual(typeof tc.showTip, 'function', 'showTip method is defined');
		assert.strictEqual(typeof tc.hideTip, 'function', 'hideTip method is defined');
		assert.strictEqual(typeof tc.resetPosition, 'function', 'resetPosition method is defined');
	});

	QUnit.test('custom PowerTip events fire', function(assert) {
		var done = assert.async(),
			element = $('<span />').data(DATA_POWERTIP, 'This is the tooltip text.'),
			tc = new TooltipController(zeroTimeOpts),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		assert.expect(9);

		element.on({
			powerTipPreRender: function() {
				assert.ok(true, 'powerTipPreRender fired');
				assert.notStrictEqual(tipElem.text(), 'This is the tooltip text.', 'tooltip content has not been inserted yet');
			},
			powerTipRender: function() {
				assert.ok(true, 'powerTipRender fired');
				assert.strictEqual(tipElem.text(), 'This is the tooltip text.', 'tooltip content has been inserted');
			},
			powerTipOpen: function() {
				assert.ok(true, 'powerTipClose fired');
				assert.strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');
				tc.hideTip(element);
			},
			powerTipClose: function() {
				assert.ok(true, 'powerTipClose fired');
				assert.strictEqual(tipElem.text(), 'This is the tooltip text.', 'tooltip content still exists');
				assert.strictEqual(tipElem.css('display'), 'none', 'display set to none');
				done();
			}
		});

		tc.showTip(element);
	});

	QUnit.test('showTip opens tooltip and hideTip closes it', function(assert) {
		var done = assert.async(),
			element = $('<span />').data(DATA_POWERTIP, 'This is the tooltip text.'),
			tc = new TooltipController(zeroTimeOpts),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		assert.expect(2);

		element.on({
			powerTipOpen: function() {
				assert.strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');
				tc.hideTip(element);
			},
			powerTipClose: function() {
				assert.strictEqual(tipElem.css('display'), 'none', 'display set to none');
				done();
			}
		});

		tc.showTip(element);
	});

	QUnit.test('TooltipController uses custom id', function(assert) {
		// let the TooltipController create the element
		var tc = new TooltipController($.extend({}, zeroTimeOpts, { popupId: 'popupId' }));

		assert.strictEqual($('#popupId').length, 1, 'custom id element created');

		// clean up
		$('#popupId').remove();

		// this is solely to make the linter happy
		tc.foo = 0;
	});

	QUnit.test('TooltipController adds placement classes', function(assert) {
		var done = assert.async(),
			placementList = [],
			tipElem;

		assert.expect(Object.keys($.fn.powerTip.smartPlacementLists).length);

		// function that actually runs a test
		function testPlacementClass(placement) {
			var element = $('<span />').data(DATA_POWERTIP, 'This is the tooltip text.'),
				opts = $.extend({}, zeroTimeOpts, { placement: placement }),
				tc = new TooltipController(opts);

			// the element wont exist until it's built by a TooltipController,
			// so we must grab it here
			if (!tipElem) {
				tipElem = $('#' + $.fn.powerTip.defaults.popupId);
			}

			element.on({
				powerTipOpen: function() {
					assert.strictEqual(tipElem.hasClass(placement), true, placement + ' placement class added');
					tc.hideTip(element);
				},
				powerTipClose: function() {
					runNextTest();
				}
			});

			tc.showTip(element);
		}

		// function to run the next test in the placementList queue
		function runNextTest() {
			var nextPlacement = placementList.shift();
			if (nextPlacement) {
				testPlacementClass(nextPlacement);
			} else {
				done();
			}
		}

		// populate placement list
		$.each($.fn.powerTip.smartPlacementLists, function(key) {
			placementList.push(key);
		});

		// start the tests
		runNextTest();
	});

	QUnit.test('resetPosition removes old placement classes', function(assert) {
		var placement = 'se',
			element = $('<span />').data(DATA_POWERTIP, 'This is the tooltip text.'),
			tc = new TooltipController($.extend({}, zeroTimeOpts, { placement: placement })),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId),
			allClasses = Object.keys($.fn.powerTip.smartPlacementLists),
			key;

		assert.expect(allClasses.length - 1);

		tipElem.addClass(allClasses.join(' '));
		tc.resetPosition(element);

		for (key in $.fn.powerTip.smartPlacementLists) {
			if (key !== placement) {
				assert.strictEqual(tipElem.hasClass(key), false, 'tooltip element does not have class: ' + key);
			}
		}
	});

	QUnit.test('TooltipController adds custom classes', function(assert) {
		var done = assert.async(),
			element = $('<span />').data(DATA_POWERTIP, 'This is the tooltip text.'),
			tc = new TooltipController($.extend({}, zeroTimeOpts, { popupClass: 'customClass' })),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		assert.expect(1);

		element.on({
			powerTipOpen: function() {
				assert.strictEqual(tipElem.hasClass('customClass'), true, 'custom class added');
				tc.hideTip(element);
			},
			powerTipClose: function() {
				done();
			}
		});

		tc.showTip(element);
	});
});
