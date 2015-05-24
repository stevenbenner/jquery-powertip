$(function() {
	'use strict';

	QUnit.module('CSS Coordinates');

	QUnit.test('expose properties', function(assert) {
		var coords = new CSSCoordinates();
		assert.strictEqual(coords.top, 'auto', 'top property is defined');
		assert.strictEqual(coords.left, 'auto', 'left property is defined');
		assert.strictEqual(coords.right, 'auto', 'right property is defined');
		assert.strictEqual(coords.bottom, 'auto', 'bottom property is defined');
	});

	QUnit.test('expose methods', function(assert) {
		var coords = new CSSCoordinates();
		assert.strictEqual(typeof coords.set, 'function', 'set method is defined');
	});

	QUnit.test('decimal values are rounded', function(assert) {
		var coords = new CSSCoordinates();

		coords.set('top', 10.5);
		coords.set('left', 10.4);
		coords.set('right', 10.499);
		coords.set('bottom', 10.50000000000001);

		assert.strictEqual(coords.top, 11, 'top property was rounded up');
		assert.strictEqual(coords.left, 10, 'left property was rounded down');
		assert.strictEqual(coords.right, 10, 'right property was rounded down');
		assert.strictEqual(coords.bottom, 11, 'bottom property was rounded up');
	});
});
