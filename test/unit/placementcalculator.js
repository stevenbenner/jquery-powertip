'use strict';

$(function() {
	QUnit.module('Placement Calculator');

	QUnit.test('expose methods', function(assert) {
		var pc = new PlacementCalculator();
		assert.strictEqual(typeof pc.compute, 'function', 'compute method is defined');
	});

	QUnit.test('return CSSCordinates object', function(assert) {
		var pc = new PlacementCalculator(),
			element = $('<div>Some Content</div>'),
			retVal = pc.compute(
				element,
				$.fn.powerTip.defaults.placement,
				element.width(),
				element.height(),
				$.fn.powerTip.defaults.offset
			);

		assert.ok(retVal instanceof CSSCoordinates);
	});

	QUnit.test('return expected CSSCordinates properties', function(assert) {
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
					assert.strictEqual(coords.top, 'auto', key + ': top property is set to auto');
					assert.strictEqual(typeof coords.left, 'number', key + ': left property is set to a number');
					assert.strictEqual(coords.right, 'auto', key + ': right property is set to auto');
					assert.strictEqual(typeof coords.bottom, 'number', key + ': bottom property is set to a number');
					break;
				case 'e':
				case 's':
				case 'se':
				case 'sw-alt':
					assert.strictEqual(typeof coords.top, 'number', key + ': top property is set to a number');
					assert.strictEqual(typeof coords.left, 'number', key + ': left property is set to a number');
					assert.strictEqual(coords.right, 'auto', key + ': right property is set to auto');
					assert.strictEqual(coords.bottom, 'auto', key + ': bottom property is set to auto');
					break;
				case 'w':
				case 'sw':
				case 'se-alt':
					assert.strictEqual(typeof coords.top, 'number', key + ': top property is set to a number');
					assert.strictEqual(coords.left, 'auto', key + ': left property is set to auto');
					assert.strictEqual(typeof coords.right, 'number', key + ': right property is set to a number');
					assert.strictEqual(coords.bottom, 'auto', key + ': bottom property is set to auto');
					break;
				case 'nw':
				case 'ne-alt':
					assert.strictEqual(coords.top, 'auto', key + ': top property is set to auto');
					assert.strictEqual(coords.left, 'auto', key + ': left property is set to auto');
					assert.strictEqual(typeof coords.right, 'number', key + ': right property is set to a number');
					assert.strictEqual(typeof coords.bottom, 'number', key + ': bottom property is set to a number');
					break;
			}
		});
	});
});
