$(function() {
	'use strict';

	// set of default options with zero fade time for faster testing
	var zeroTimeOpts = $.extend({}, $.fn.powerTip.defaults, { fadeInTime: 0, fadeOutTime: 0 });

	module('Tooltip Controller');

	test('expose methods', function() {
		var tc = new TooltipController($.fn.powerTip.defaults);
		strictEqual(typeof tc.showTip, 'function', 'showTip method is defined');
		strictEqual(typeof tc.hideTip, 'function', 'hideTip method is defined');
		strictEqual(typeof tc.resetPosition, 'function', 'resetPosition method is defined');
	});

	asyncTest('custom PowerTip events fire', function() {
		var element = $('<span />').data(DATA_POWERTIP, 'This is the tooltip text.'),
			tc = new TooltipController(zeroTimeOpts),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(9);

		element.on({
			powerTipPreRender: function() {
				ok(true, 'powerTipPreRender fired');
				notStrictEqual(tipElem.text(), 'This is the tooltip text.', 'tooltip content has not been inserted yet');
			},
			powerTipRender: function() {
				ok(true, 'powerTipRender fired');
				strictEqual(tipElem.text(), 'This is the tooltip text.', 'tooltip content has been inserted');
			},
			powerTipOpen: function() {
				ok(true, 'powerTipClose fired');
				strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');
				tc.hideTip(element);
			},
			powerTipClose: function() {
				ok(true, 'powerTipClose fired');
				strictEqual(tipElem.text(), 'This is the tooltip text.', 'tooltip content still exists');
				strictEqual(tipElem.css('display'), 'none', 'display set to none');
				start();
			}
		});

		tc.showTip(element);
	});

	asyncTest('showTip opens tooltip and hideTip closes it', function() {
		var element = $('<span />').data(DATA_POWERTIP, 'This is the tooltip text.'),
			tc = new TooltipController(zeroTimeOpts),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(2);

		element.on({
			powerTipOpen: function() {
				strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');
				tc.hideTip(element);
			},
			powerTipClose: function() {
				strictEqual(tipElem.css('display'), 'none', 'display set to none');
				start();
			}
		});

		tc.showTip(element);
	});

	test('TooltipController uses custom id', function() {
		// let the TooltipController create the element
		var tc = new TooltipController($.extend({}, zeroTimeOpts, { popupId: 'popupId' }));

		strictEqual($('#popupId').length, 1, 'custom id element created');

		// this is solely to make the linter happy
		tc.foo = 0;
	});

	asyncTest('TooltipController adds placement classes', function() {
		var placementList = [],
			tipElem;

		expect(Object.keys($.fn.powerTip.smartPlacementLists).length);

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
					strictEqual(tipElem.hasClass(placement), true, placement + ' placement class added');
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
				start();
			}
		}

		// populate placement list
		$.each($.fn.powerTip.smartPlacementLists, function(key) {
			placementList.push(key);
		});

		// start the tests
		runNextTest();
	});

	asyncTest('TooltipController adds custom classes', function() {
		var element = $('<span />').data(DATA_POWERTIP, 'This is the tooltip text.'),
			tc = new TooltipController($.extend({}, zeroTimeOpts, { popupClass: 'customClass' })),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(1);

		element.on({
			powerTipOpen: function() {
				strictEqual(tipElem.hasClass('customClass'), true, 'custom class added');
				tc.hideTip(element);
			},
			powerTipClose: function() {
				start();
			}
		});

		tc.showTip(element);
	});

});
