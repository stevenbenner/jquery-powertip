/*global
	session:true
	isSvgElement:true
	computeElementSize:true
	initMouseTracking:true
	trackMouse:true
	isMouseOver:true
	getViewportCollisions:true*/
$(function() {
	'use strict';

	module('Utility Functions');

	test('isSvgElement', function() {
		var div = $('<div />'),
			rect = $(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));

		ok(isSvgElement(rect), 'rect is an SVG element');
		ok(!isSvgElement(div), 'div is not an SVG element');
	});

	test('computeElementSize', function() {
		var div = $('<div/>').css({ width: '300px', height: '200px' }).appendTo($('body')),
			divSize = computeElementSize(div);

		strictEqual(divSize.width, 300, 'div width is correct');
		strictEqual(divSize.height, 200, 'div height is correct');

		div.remove();
	});

	test('initMouseTracking', function() {
		session.currentX = 1;
		session.currentY = 1;

		initMouseTracking();

		$(document).trigger($.Event('mousemove', { pageX: 2, pageY: 3 }));

		strictEqual(session.currentX, 2, 'currentX updated with correct value on mousemove');
		strictEqual(session.currentY, 3, 'currentY updated with correct value on mousemove');
	});

	test('trackMouse', function() {
		session.currentX = 1;
		session.currentY = 1;

		trackMouse($.Event('mousemove', { pageX: 4, pageY: 5 }));

		strictEqual(session.currentX, 4, 'currentX updated with correct value on mousemove');
		strictEqual(session.currentY, 5, 'currentY updated with correct value on mousemove');
	});

	test('isMouseOver', function() {
		var div = $('<div />')
			.css({
				position: 'absolute',
				top: '10px',
				left: '30px',
				width: '50px',
				height: '20px'
			})
			.appendTo('body');

		session.currentX = 30;
		session.currentY = 10;
		ok(isMouseOver(div), 'top/left hover detected');

		session.currentX = 55;
		session.currentY = 15;
		ok(isMouseOver(div), 'center hover detected');

		session.currentX = 80;
		session.currentY = 30;
		ok(isMouseOver(div), 'bottom/right hover detected');

		session.currentX = 9;
		session.currentY = 29;
		ok(!isMouseOver(div), 'no hover detected');

		session.currentX = 81;
		session.currentY = 31;
		ok(!isMouseOver(div), 'no hover detected');

		div.remove();
	});

	test('getViewportCollisions', function() {
		var windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			none, right, bottom, bottomRight, top, left, topLeft;

		function doTests() {
			ok(none.length === 0, 'no collisions detected');
			ok(right.length === 1 && $.inArray('right', right) >= 0, 'right collision detected');
			ok(bottom.length === 1 && $.inArray('bottom', bottom) >= 0, 'bottom collision detected');
			ok(bottomRight.length === 2 && $.inArray('bottom', bottomRight) >= 0 && $.inArray('right', bottomRight) >= 0, 'bottom right collision detected');
			ok(top.length === 1 && $.inArray('top', top) >= 0, 'top collision detected');
			ok(left.length === 1 && $.inArray('left', left) >= 0, 'left collision detected');
			ok(topLeft.length === 2 && $.inArray('top', topLeft) >= 0 && $.inArray('left', topLeft) >= 0, 'top left collision detected');
		}

		// top/left placement
		none = getViewportCollisions({ top: 0, left: 0 }, 200, 100);
		right = getViewportCollisions({ top: 0, left: windowWidth - 199 }, 200, 100);
		bottom = getViewportCollisions({ top: windowHeight - 99, left: 0 }, 200, 100);
		bottomRight = getViewportCollisions({ top: windowHeight - 99, left: windowWidth - 199 }, 200, 100);
		top = getViewportCollisions({ top: -1, left: 0 }, 200, 100);
		left = getViewportCollisions({ top: 0, left: -1 }, 200, 100);
		topLeft = getViewportCollisions({ top: -1, left: -1 }, 200, 100);

		doTests();

		// top/right placement
		none = getViewportCollisions({ top: 0, right: 0 }, 200, 100);
		right = getViewportCollisions({ top: 0, right: -1 }, 200, 100);
		bottom = getViewportCollisions({ top: windowHeight - 99, right: 0 }, 200, 100);
		bottomRight = getViewportCollisions({ top: windowHeight - 99, right: -1 }, 200, 100);
		top = getViewportCollisions({ top: -1, right: 0 }, 200, 100);
		left = getViewportCollisions({ top: 0, right: windowWidth - 199 }, 200, 100);
		topLeft = getViewportCollisions({ top: -1, right: windowWidth - 199 }, 200, 100);

		doTests();
	});

});
