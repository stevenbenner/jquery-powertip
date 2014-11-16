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

	test('return expected CSSCordinates properties', function() {
		var pc = new PlacementCalculator(),
			element = $('<div>Some Content</div>'),
			coords;

		$.each($.fn.powerTip.smartPlacementLists, function(key) {
			coords = pc.compute(
				element,
				key,
				element.width(),
				element.height(),
				$.fn.powerTip.defaults.offset
			);

			switch (key) {
			case 'n':
			case 'ne':
			case 'nw-alt':
				strictEqual(coords.top, 'auto', key + ': top property is set to auto');
				strictEqual($.isNumeric(coords.left), true, key + ': left property is set to a number');
				strictEqual(coords.right, 'auto', key + ': right property is set to auto');
				strictEqual($.isNumeric(coords.bottom), true, key + ': bottom property is set to a number');
				break;
			case 'e':
			case 's':
			case 'se':
			case 'sw-alt':
				strictEqual($.isNumeric(coords.top), true, key + ': top property is set to a number');
				strictEqual($.isNumeric(coords.left), true, key + ': left property is set to a number');
				strictEqual(coords.right, 'auto', key + ': right property is set to auto');
				strictEqual(coords.bottom, 'auto', key + ': bottom property is set to auto');
				break;
			case 'w':
			case 'sw':
			case 'se-alt':
				strictEqual($.isNumeric(coords.top), true, key + ': top property is set to a number');
				strictEqual(coords.left, 'auto', key + ': left property is set to auto');
				strictEqual($.isNumeric(coords.right), true, key + ': right property is set to a number');
				strictEqual(coords.bottom, 'auto', key + ': bottom property is set to auto');
				break;
			case 'nw':
			case 'ne-alt':
				strictEqual(coords.top, 'auto', key + ': top property is set to auto');
				strictEqual(coords.left, 'auto', key + ': left property is set to auto');
				strictEqual($.isNumeric(coords.right), true, key + ': right property is set to a number');
				strictEqual($.isNumeric(coords.bottom), true, key + ': bottom property is set to a number');
				break;
			}
		});
	});
});
