$(function() {
	'use strict';

	module('CSS Coordinates');

	test('expose properties', function() {
		var coords = new CSSCoordinates();
		strictEqual(coords.top, 'auto', 'top property is defined');
		strictEqual(coords.left, 'auto', 'left property is defined');
		strictEqual(coords.right, 'auto', 'right property is defined');
		strictEqual(coords.bottom, 'auto', 'bottom property is defined');
	});

	test('expose methods', function() {
		var coords = new CSSCoordinates();
		strictEqual(typeof coords.set, 'function', 'set method is defined');
	});

	test('decimal values are rounded', function() {
		var coords = new CSSCoordinates();

		coords.set('top', 10.5);
		coords.set('left', 10.4);
		coords.set('right', 10.499);
		coords.set('bottom', 10.50000000000001);

		strictEqual(coords.top, 11, 'top property was rounded up');
		strictEqual(coords.left, 10, 'left property was rounded down');
		strictEqual(coords.right, 10, 'right property was rounded down');
		strictEqual(coords.bottom, 11, 'bottom property was rounded up');
	});

});
