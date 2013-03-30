$(function() {
	'use strict';

	module('Utility Functions');

	test('isSvgElement', function() {
		var div = $('<div />'),
			rect = $(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));

		strictEqual(isSvgElement(rect), true, 'rect is an SVG element');
		strictEqual(isSvgElement(div), false, 'div is not an SVG element');
	});

	test('initTracking', function() {
		session.currentX = 1;
		session.currentY = 1;

		initTracking();

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

	test('getTooltipContent', function() {
		var powertip = $('<div />').data(DATA_POWERTIP, 'powertip'),
			powertipFunc = $('<div />').data(DATA_POWERTIP, function() { return 'powertipFunc'; }),
			jqObject = $('<div><b>powertipjq</b></div>'),
			powertipjq = $('<div />').data(DATA_POWERTIPJQ, jqObject),
			powertipjqFunc = $('<div />').data(DATA_POWERTIPJQ, function() { return jqObject; }),
			powertiptarget = $('<div />').data(DATA_POWERTIPTARGET, 'tiptargettest'),
			targetDiv = $('<div />').attr('id', 'tiptargettest').text('tiptargettest');

		// add powertiptarget to body
		targetDiv.appendTo($('body'));

		strictEqual(getTooltipContent(powertip), 'powertip', 'data-powertip text parsed');
		strictEqual(getTooltipContent(powertipFunc), 'powertipFunc', 'data-powertip function parsed');
		strictEqual(getTooltipContent(powertipjq).find('b').text(), 'powertipjq', 'data-powertipjq object parsed');
		strictEqual(getTooltipContent(powertipjqFunc).find('b').text(), 'powertipjq', 'data-powertipjq function parsed');
		strictEqual(getTooltipContent(powertiptarget), 'tiptargettest', 'data-powertiptarget reference parsed');

		// remove target test div
		targetDiv.remove();
	});

	test('countFlags', function() {
		var zero = Collision.none,
			one = Collision.top,
			two = Collision.top | Collision.left,
			three = Collision.top | Collision.left | Collision.right,
			four = Collision.top | Collision.left | Collision.right | Collision.bottom;

		strictEqual(countFlags(zero), 0, 'Found zero flags.');
		strictEqual(countFlags(one), 1, 'Found one flag.');
		strictEqual(countFlags(two), 2, 'Found two flags.');
		strictEqual(countFlags(three), 3, 'Found three flags.');
		strictEqual(countFlags(four), 4, 'Found four flags.');
	});

	test('getViewportCollisions', function() {
		var windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			none, right, bottom, bottomRight, top, left, topLeft;

		function doTests() {
			strictEqual(none, Collision.none, 'no collisions detected');
			strictEqual(countFlags(right), 1, 'exactly one collision detected for right test');
			strictEqual(right & Collision.right, Collision.right, 'right collision detected for right test');
			strictEqual(countFlags(bottom), 1, 'exactly one collision detected for bottom test');
			strictEqual(bottom & Collision.bottom, Collision.bottom, 'bottom collision detected for bottom test');
			strictEqual(countFlags(bottomRight), 2, 'exactly two collisions detected for bottom-right test');
			strictEqual(bottomRight & Collision.bottom, Collision.bottom, 'bottom collision detected for bottom-right test');
			strictEqual(bottomRight & Collision.right, Collision.right, 'right collision detected for bottom-right test');
			strictEqual(countFlags(top), 1, 'exactly one collision detected for top test');
			strictEqual(top & Collision.top, Collision.top, 'top collision detected for top test');
			strictEqual(countFlags(left), 1, 'exactly one collision detected for left test');
			strictEqual(left & Collision.left, Collision.left, 'left collision detected for left test');
			strictEqual(countFlags(topLeft), 2, 'exactly two collisions detected for top-left test');
			strictEqual(topLeft & Collision.top, Collision.top, 'top collision detected for top-left test');
			strictEqual(topLeft & Collision.left, Collision.left, 'left collision detected for top-left test');
		}

		// need to make sure initTracking() has been invoked to populate the
		// viewport dimensions cache
		initTracking();

		// top/left placement
		none = getViewportCollisions({ top: 0, left: 0 }, 200, 100);
		right = getViewportCollisions({ top: 0, left: windowWidth - 199 }, 200, 100);
		bottom = getViewportCollisions({ top: windowHeight - 99, left: 0 }, 200, 100);
		bottomRight = getViewportCollisions({ top: windowHeight - 99, left: windowWidth - 199 }, 200, 100);
		top = getViewportCollisions({ top: -1, left: 0 }, 200, 100);
		left = getViewportCollisions({ top: 0, left: -1 }, 200, 100);
		topLeft = getViewportCollisions({ top: -1, left: -1 }, 200, 100);

		doTests();

		// bottom/right placement
		none = getViewportCollisions({ bottom: 0, right: 0 }, 200, 100);
		right = getViewportCollisions({ bottom: 0, right: -1 }, 200, 100);
		bottom = getViewportCollisions({ bottom: -1, right: 0 }, 200, 100);
		bottomRight = getViewportCollisions({ bottom: -1, right: -1 }, 200, 100);
		top = getViewportCollisions({ bottom: windowHeight - 99, right: 0 }, 200, 100);
		left = getViewportCollisions({ bottom: 0, right: windowWidth - 199 }, 200, 100);
		topLeft = getViewportCollisions({ bottom: windowHeight - 99, right: windowWidth - 199 }, 200, 100);

		doTests();
	});

});
