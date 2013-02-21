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

		strictEqual(tipElem.css('display'), 'none', 'display set to none');

		tc.showTip(element);

		strictEqual(tipElem.css('display'), 'block', 'display set to block');
		notStrictEqual(tipElem.css('opacity'), '1', 'tooltip is not faded in');

		setTimeout(function() {
			strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');

			tc.hideTip(element);

			setTimeout(function() {
				notStrictEqual(tipElem.css('opacity'), '0', 'tooltip is not faded out');
			}, $.fn.powerTip.defaults.fadeOutTime - 10);

			setTimeout(function() {
				strictEqual(tipElem.css('display'), 'none', 'display set to none');
				start();
			}, $.fn.powerTip.defaults.fadeOutTime + 10);
		}, $.fn.powerTip.defaults.fadeInTime + 10);
	});

});
