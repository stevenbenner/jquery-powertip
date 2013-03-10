$(function() {
	'use strict';

	module('Placement Calculator');

	test('expose methods', function() {
		var pc = new PlacementCalculator();
		strictEqual(typeof pc.compute, 'function', 'compute method is defined');
	});

	test('return CSSCordinates object', function() {
		var pc = new PlacementCalculator(),
			element = $('<div>Some Content</div>'),
			retVal = pc.compute(
				element,
				$.fn.powerTip.defaults.placement,
				element.width(),
				element.height(),
				$.fn.powerTip.defaults.offset
			);

		ok(retVal instanceof CSSCoordinates);
	});

});
