(function runTests() {
	'use strict';

	var QUnit = require('qunitjs'),
		$ = require('jquery'),
		powerTip = require('./../dist/jquery.powertip.js');

	QUnit.module('Browserify');

	QUnit.test('powerTip is loaded into $.fn', function(assert) {
		var element = $('<a href="#" title="This is the tooltip text"></a>');
		assert.strictEqual(typeof element.powerTip, 'function', 'powerTip is defined');
	});

	QUnit.test('expose API via jQuery', function(assert) {
		assert.strictEqual(typeof $.powerTip.show, 'function', 'show is defined');
		assert.strictEqual(typeof $.powerTip.reposition, 'function', 'reposition is defined');
		assert.strictEqual(typeof $.powerTip.hide, 'function', 'hide is defined');
		assert.strictEqual(typeof $.powerTip.toggle, 'function', 'toggle is defined');
		assert.strictEqual(typeof $.powerTip.destroy, 'function', 'destroy is defined');
	});

	QUnit.test('expose API is returned from require()', function(assert) {
		assert.strictEqual(typeof powerTip.show, 'function', 'show is defined');
		assert.strictEqual(typeof powerTip.reposition, 'function', 'reposition is defined');
		assert.strictEqual(typeof powerTip.hide, 'function', 'hide is defined');
		assert.strictEqual(typeof powerTip.toggle, 'function', 'toggle is defined');
		assert.strictEqual(typeof powerTip.destroy, 'function', 'destroy is defined');
	});
})();
