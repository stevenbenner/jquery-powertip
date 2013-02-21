$(function() {
	'use strict';

	module('Integration');

	//////////////////// CORE TESTS ////////////////////

	test('powerTip defined', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '"></a>');
		strictEqual(typeof element.powerTip, 'function', 'powerTip method is defined');
	});

	test('expose default settings', function() {
		ok($.fn.powerTip.defaults, 'defaults is defined');
		ok($.fn.powerTip.defaults.hasOwnProperty('fadeInTime'), 'fadeInTime exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('fadeOutTime'), 'fadeOutTime exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('followMouse'), 'followMouse exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('popupId'), 'popupId exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('intentSensitivity'), 'intentSensitivity exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('intentPollInterval'), 'intentPollInterval exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('closeDelay'), 'closeDelay exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('placement'), 'placement exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('smartPlacement'), 'smartPlacement exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('offset'), 'offset exists');
		ok($.fn.powerTip.defaults.hasOwnProperty('mouseOnToPopup'), 'mouseOnToPopup exists');
	});

	test('expose smart placement lists', function() {
		ok($.fn.powerTip.smartPlacementLists, 'smartPlacementLists is defined');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('n'), 'n exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('e'), 'e exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('s'), 's exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('w'), 'w exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('ne'), 'ne exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('nw'), 'nw exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('se'), 'se exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('sw'), 'sw exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('ne-alt'), 'ne-alt exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('nw-alt'), 'nw-alt exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('se-alt'), 'se-alt exists');
		ok($.fn.powerTip.smartPlacementLists.hasOwnProperty('sw-alt'), 'sw-alt exists');
	});

	test('return original jQuery object', function() {
		var div = $('<div></div>'),
			empty = $('#thisDoesntExist');
		deepEqual(div.powerTip(), div, 'original jQuery object returned for matched selector');
		deepEqual(empty.powerTip(), empty, 'original jQuery object returned for empty selector');
	});

	test('remove title attribute', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '"></a>').powerTip();
		ok(!element.attr('title'), 'title attribute was removed');
	});

	test('destroy rolls back title', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '"></a>').powerTip();
		ok(!element.attr('title'), 'title attribute was removed');
		element.powerTip('destroy');
		strictEqual(element.attr('title'), tipText, 'title attribute was added back');
	});

	//////////////////// API TESTS ////////////////////

	test('expose API', function() {
		ok($.powerTip, 'API is defined');
		strictEqual(typeof $.powerTip.show, 'function', 'show method is defined');
		strictEqual(typeof $.powerTip.reposition, 'function', 'reposition method is defined');
		strictEqual(typeof $.powerTip.hide, 'function', 'closeTip method is defined');
		// deprecated
		strictEqual(typeof $.powerTip.showTip, 'function', 'showTip method is defined');
		strictEqual(typeof $.powerTip.closeTip, 'function', 'closeTip method is defined');
	});

	asyncTest('showTip should open a tooltip and closeTip should close it', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '"></a>').powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(2);

		element.on({
			powerTipOpen: function() {
				strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');
				$.powerTip.closeTip();
			},
			powerTipClose: function() {
				strictEqual(tipElem.css('display'), 'none', 'display set to none');
				start();
			}
		});

		// tell powertip that the mouse isn't over the element
		// which will appear to be at 0,0 to jQuery
		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		$.powerTip.showTip(element);
	});

	asyncTest('.powerTip("show") should open a tooltip and .powerTip("hide", true) should close it immediately', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '"></a>').powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(2);

		element.on({
			powerTipOpen: function() {
				strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');
				element.powerTip('hide', true);
			},
			powerTipClose: function() {
				strictEqual(tipElem.css('display'), 'none', 'display set to none');
				start();
			}
		});

		// tell powertip that the mouse isn't over the element
		// which will appear to be at 0,0 to jQuery
		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		element.powerTip('show');
	});

	//////////////////// CONTENT SUPPORT TESTS ////////////////////

	asyncTest('handle title attribute', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '"></a>').powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(1);

		openExecCloseAndContinue(element, function() {
			strictEqual(tipElem.text(), tipText, 'title text used in tooltip');
		});
	});

	asyncTest('handle powertip data attribute', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" data-powertip="' + tipText + '"></a>').powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(1);

		openExecCloseAndContinue(element, function() {
			strictEqual(tipElem.text(), tipText, 'data-powertip text used in tooltip');
		});
	});

	asyncTest('handle powertip data with function source', function() {
		var tipText = getRandomString(),
			element = $('<a href="#"></a>')
				.data('powertip', function() {
					return tipText;
				})
				.powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(1);

		openExecCloseAndContinue(element, function() {
			strictEqual(tipElem.text(), tipText, 'powertip text used in tooltip');
		});
	});

	asyncTest('handle powertipjq jQuery data', function() {
		var tipText = getRandomString(),
			element = $('<a href="#"></a>')
				.data('powertipjq', $('<b>' + tipText + '</b>'))
				.powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(1);

		openExecCloseAndContinue(element, function() {
			strictEqual(tipElem.find('b').text(), tipText, 'powertipjq text used in tooltip');
		});
	});

	asyncTest('handle powertipjq data with function source', function() {
		var tipText = getRandomString(),
			element = $('<a href="#"></a>')
				.data('powertipjq', function() {
					return $('<b>' + tipText + '</b>');
				})
				.powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(1);

		openExecCloseAndContinue(element, function() {
			strictEqual(tipElem.find('b').text(), tipText, 'powertip text used in tooltip');
		});
	});

	asyncTest('handle powertiptarget DOM object source data', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" data-powertiptarget="test-target"></a>').powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(1);

		$('body').append($('<div id="test-target" style="display:none;">' + tipText + '</div>'));

		openExecCloseAndContinue(element, function() {
			strictEqual(tipElem.text(), tipText, 'text from the target element used in tooltip');
		});
	});

	asyncTest('handle HTML entities in data-powertip', function() {
		var element = $('<a href="#"></a>')
				.data('powertip', 'This <invalid>is</invalid> the <b>tooltip text</b> and <code>{ some: code }</code>')
				.powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(3);

		openExecCloseAndContinue(element, function() {
			ok(tipElem.find('b').length, 'b element was inserted');
			ok(tipElem.find('code').length, 'code element was inserted');
			ok(tipElem.find('invalid').length, 'invalid element was inserted');
		});
	});

	asyncTest('preserve custom events in powertipjq jQuery data', function() {
		var tipText = getRandomString(),
			jqObject = $('<b>' + tipText + '</b>')
				.on('click', function() {
					clickFired = true;
				}),
			element = $('<a href="#"></a>')
				.data('powertipjq', jqObject)
				.powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId),
			clickFired = false;

		expect(1);

		openExecCloseAndContinue(element, function() {
			tipElem.find('b').trigger('click');
			ok(clickFired, 'click event fired');
		});
	});

	//////////////////// MOUSE SUPPORT TESTS ////////////////////

	asyncTest('should not show tooltip if the mouse leaves the element before the intent interval', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '"></a>').powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(1);

		element.trigger('mouseenter');

		setTimeout(function() {
			element.trigger('mouseleave');
		}, $.fn.powerTip.defaults.intentPollInterval - 50);

		setTimeout(function() {
			strictEqual(tipElem.css('display'), 'none', 'display set to none');
			start();
		}, $.fn.powerTip.defaults.intentPollInterval + 50);
	});

	asyncTest('should not show tooltip if the mouse keeps moving', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '"></a>').powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId),
			i = 0, x = 0, y = 0;

		expect(10);

		var changeMousePosition = function() {
			if (i < 10) {
				strictEqual(tipElem.css('display'), 'none', 'display set to none');

				// move the mouse cursor and run the test again
				x += $.fn.powerTip.defaults.intentSensitivity;
				y += $.fn.powerTip.defaults.intentSensitivity;
				$(document).trigger($.Event('mousemove', { pageX: x, pageY: y }));
				setTimeout(changeMousePosition, $.fn.powerTip.defaults.intentPollInterval);
			} else {
				// we're done testing
				element.trigger('mouseleave');
				start();
			}

			i++;
		};

		element.trigger('mouseenter');

		setTimeout(changeMousePosition, $.fn.powerTip.defaults.intentPollInterval);
	});

	asyncTest('tooltip should open on mouse enter and close on mouse leave', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '">TESTTESTTEST</a>')
				.css({
					display: 'block',
					position: 'absolute',
					top: 150,
					left: 150
				})
				.powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId),
			fauxMouseLocation = { pageX: element.offset().top, pageY: element.offset().left };

		expect(3);

		element.on({
			powerTipOpen: function() {
				strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');
				element.trigger('mouseleave');
			},
			powerTipClose: function() {
				strictEqual(tipElem.css('display'), 'none', 'display set to none');
				start();
			}
		});

		// sanity check - tooltip should be closed before testing
		strictEqual(tipElem.css('display'), 'none', 'display set to none');

		// tell powertip that the mouse is over the element
		$(document).trigger($.Event('mousemove', fauxMouseLocation));
		element.trigger($.Event('mouseenter', fauxMouseLocation));
	});

	//////////////////// KEYBOARD SUPPORT TESTS ////////////////////

	asyncTest('tooltips should open when they receive focus and close when they blur', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '">TEXT</a>').powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(2);

		element.on({
			powerTipOpen: function() {
				strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');
				element.trigger('blur');
			},
			powerTipClose: function() {
				strictEqual(tipElem.css('display'), 'none', 'display set to none');
				element.remove();
				start();
			}
		});

		// jquery 1.9 will not trigger a focus event on an element that cannot
		// be focused, so we have to append the test element to the document
		// before the focus test will work
		$('body').prepend(element);

		// tell powertip that the mouse isn't over the element
		// which will appear to be at 0,0 to jQuery
		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		element.trigger('focus');
	});

	asyncTest('tooltip should close when escape key is pressed', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '"></a>').powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		expect(2);

		element.on({
			powerTipOpen: function() {
				strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');
				element.trigger($.Event('keydown', { keyCode: 27 }));
			},
			powerTipClose: function() {
				strictEqual(tipElem.css('display'), 'none', 'display set to none');
				start();
			}
		});

		$.powerTip.showTip(element);
	});

	//////////////////// EVENT TESTS ////////////////////

	asyncTest('all events should fire during the tooltip life cycle', function() {
		var tipText = getRandomString(),
			element = $('<a href="#" title="' + tipText + '"></a>').powerTip(),
			tipElem = $('#' + $.fn.powerTip.defaults.popupId);

		expect(5);

		element.on({
			powerTipPreRender: function() {
				notStrictEqual(tipElem.text(), tipText, 'tooltip content has not been inserted yet');
			},
			powerTipRender: function() {
				strictEqual(tipElem.text(), tipText, 'tooltip content has been inserted');
			},
			powerTipOpen: function() {
				strictEqual(tipElem.css('opacity'), '1', 'tooltip is faded in');
				$.powerTip.closeTip();
			},
			powerTipClose: function() {
				strictEqual(tipElem.text(), tipText, 'tooltip content still exists');
				strictEqual(tipElem.css('display'), 'none', 'display set to none');
				start();
			}
		});

		// tell powertip that the mouse isn't over the element
		// which will appear to be at 0,0 to jQuery
		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		$.powerTip.showTip(element);
	});

	/**
	 * Performs a tooltip open and close cycle for the specified element,
	 * executes the callbacks when the appropriate events fire, then ends the
	 * test by invoking the start() function.
	 * @param {jQuery} element The element to open the tooltip for.
	 * @param {Function=} fnOpen Callback to invoke when the tooltip opens.
	 * @param {Function=} fnClose Callback to invoke when the tooltip closes.
	 */
	function openExecCloseAndContinue(element, fnOpen, fnClose) {
		// tell powertip that the mouse isn't over the element
		// which will appear to be at 0,0 to jQuery
		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		element.on({
			powerTipOpen: function() {
				if (fnOpen) {
					fnOpen.call();
				}
				$.powerTip.closeTip();
			},
			powerTipClose: function() {
				if (fnClose) {
					fnClose.call();
				}
				start();
			}
		});

		$.powerTip.showTip(element);
	}

	/**
	 * Returns a random string that can be used as tooltip content.
	 * This prevents tooltip content tests from colliding with content set in
	 * previous tests.
	 * @return {string}
	 */
	function getRandomString() {
		return 'This is the tooltip text. ' + Math.random();
	}
});
