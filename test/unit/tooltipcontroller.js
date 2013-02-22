/*global
	DATA_POWERTIP:true
	TooltipController:true*/
$(function() {
	'use strict';

	module('Tooltip Controller');

	test('expose methods', function() {
		var tc = new TooltipController($.fn.powerTip.defaults);
		strictEqual(typeof tc.showTip, 'function', 'showTip method is defined');
		strictEqual(typeof tc.hideTip, 'function', 'hideTip method is defined');
		strictEqual(typeof tc.resetPosition, 'function', 'resetPosition method is defined');
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
