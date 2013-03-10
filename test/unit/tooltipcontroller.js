$(function() {
	'use strict';

	module('Tooltip Controller');

	test('expose methods', function() {
		var tc = new TooltipController($.fn.powerTip.defaults);
		strictEqual(typeof tc.showTip, 'function', 'showTip method is defined');
		strictEqual(typeof tc.hideTip, 'function', 'hideTip method is defined');
		strictEqual(typeof tc.resetPosition, 'function', 'resetPosition method is defined');
	});

	asyncTest('custom PowerTip events fire', function() {
		var element = $('<span />').data(DATA_POWERTIP, 'This is the tooltip text.'),
			tc = new TooltipController($.fn.powerTip.defaults),
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
			tc = new TooltipController($.fn.powerTip.defaults),
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

});
