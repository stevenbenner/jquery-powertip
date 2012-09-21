$(function() {

	//////////////////// CORE TESTS ////////////////////

	module('PowerTip Core');

	test('powerTip defined', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>');
		ok(element.powerTip, 'powerTip method is defined');
		deepEqual(typeof element.powerTip, 'function', 'powerTip is a function');
	});

	test('expose default settings', function() {
		ok($.fn.powerTip.defaults, 'defaults is defined');
		// existance check for each property
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
		// existance check for each property
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
		var element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();
		ok(!element.attr('title'), 'title attribute was removed');
	});

	test('destroy rolls back title', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();
		ok(!element.attr('title'), 'title attribute was removed');
		element.powerTip('destroy');
		deepEqual(element.attr('title'), 'This is the tooltip text', 'title attribute was added back');
	});

	//////////////////// API TESTS ////////////////////

	module('PowerTip API');

	test('expose API', function() {
		ok($.powerTip, 'API is defined');
		ok($.powerTip.showTip, 'showTip method is defined');
		deepEqual(typeof $.powerTip.showTip, 'function', 'showTip is a function');
		ok($.powerTip.resetPosition, 'resetPosition method is defined');
		deepEqual(typeof $.powerTip.resetPosition, 'function', 'resetPosition is a function');
		ok($.powerTip.closeTip, 'closeTip method is defined');
		deepEqual(typeof $.powerTip.closeTip, 'function', 'closeTip is a function');
	});

	asyncTest('showTip should open a tooltip and closeTip should close it', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();

		// tell powertip that the mouse isn't over the element
		// which will appear to be at 0,0 to jQuery
		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		$.powerTip.showTip(element);

		deepEqual($('#powerTip').css('display'), 'block', 'display set to block');

		setTimeout(function() {
			ok($('#powerTip').css('opacity') !== '1', 'tooltip is not faded in');
		}, $.fn.powerTip.defaults.fadeInTime - 50);

		setTimeout(function() {
			deepEqual($('#powerTip').css('opacity'), '1', 'tooltip is faded in');

			$.powerTip.closeTip();

			setTimeout(function() {
				ok($('#powerTip').css('opacity') !== '0', 'tooltip is not faded out');
			}, $.fn.powerTip.defaults.fadeOutTime - 50);

			setTimeout(function() {
				deepEqual($('#powerTip').css('display'), 'none', 'display set to none');
				start();
			}, $.fn.powerTip.defaults.fadeOutTime + 50);

		}, $.fn.powerTip.defaults.fadeInTime + 50);
	});

	asyncTest('.powerTip("show") should open a tooltip and .powerTip("hide", true) should close it immediately', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();

		// tell powertip that the mouse isn't over the element
		// which will appear to be at 0,0 to jQuery
		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		element.powerTip('show');

		deepEqual($('#powerTip').css('display'), 'block', 'display set to block');

		setTimeout(function() {
			ok($('#powerTip').css('opacity') !== '1', 'tooltip is not faded in');
		}, $.fn.powerTip.defaults.fadeInTime - 50);

		setTimeout(function() {
			deepEqual($('#powerTip').css('opacity'), '1', 'tooltip is faded in');

			element.powerTip('hide', true);

			setTimeout(function() {
				ok($('#powerTip').css('opacity') !== '0', 'tooltip is not faded out');
			}, $.fn.powerTip.defaults.fadeOutTime - 50);

			setTimeout(function() {
				deepEqual($('#powerTip').css('display'), 'none', 'display set to none');
				start();
			}, $.fn.powerTip.defaults.fadeOutTime + 50);

		}, $.fn.powerTip.defaults.fadeInTime + 50);
	});


	//////////////////// CONTENT SUPPORT TESTS ////////////////////

	module('PowerTip Content Support');

	function openExecCloseAndContinue(element, callback) {
		// tell powertip that the mouse isn't over the element
		// which will appear to be at 0,0 to jQuery
		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		$.powerTip.showTip(element);

		setTimeout(function() {
			callback.call();

			$.powerTip.closeTip();

			// let the tooltip close before proceeding with the tests
			setTimeout(function() {
				start();
			}, $.fn.powerTip.defaults.fadeOutTime + 50);
		}, $.fn.powerTip.defaults.fadeInTime + 50);
	}

	asyncTest('handle title attribute', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();

		openExecCloseAndContinue(element, function() {
			deepEqual($('#powerTip').text(), 'This is the tooltip text', 'title text used in tooltip');
		});
	});

	asyncTest('handle powertip data attribute', function() {
		var element = $('<a href="#" data-powertip="This is the tooltip text"></a>').powerTip();

		openExecCloseAndContinue(element, function() {
			deepEqual($('#powerTip').text(), 'This is the tooltip text', 'data-powertip text used in tooltip');
		});
	});

	asyncTest('handle powertip data with function source', function() {
		var element = $('<a href="#"></a>')
			.data('powertip', function() {
				return 'This is the tooltip text';
			})
			.powerTip();

		openExecCloseAndContinue(element, function() {
			deepEqual($('#powerTip').text(), 'This is the tooltip text', 'powertip text used in tooltip');
		});
	});

	asyncTest('handle powertipjq jQuery data', function() {
		var element = $('<a href="#"></a>');
		element.data('powertipjq', $('<b>This is the tooltip text</b>'));
		element.powerTip();

		openExecCloseAndContinue(element, function() {
			deepEqual($('#powerTip b').text(), 'This is the tooltip text', 'powertipjq text used in tooltip');
		});
	});

	asyncTest('handle powertipjq data with function source', function() {
		var element = $('<a href="#"></a>')
			.data('powertipjq', function() {
				return $('<b>This is the tooltip text</b>');
			})
			.powerTip();

		openExecCloseAndContinue(element, function() {
			deepEqual($('#powerTip b').text(), 'This is the tooltip text', 'powertip text used in tooltip');
		});
	});

	asyncTest('handle powertiptarget DOM object source data', function() {
		$('body').append($('<div id="test-target" style="display:none;">This is the tooltip text</div>'));
		var element = $('<a href="#" data-powertiptarget="test-target"></a>');
		element.powerTip();

		openExecCloseAndContinue(element, function() {
			deepEqual($('#powerTip').text(), 'This is the tooltip text', 'text from the target element used in tooltip');
		});
	});

	asyncTest('handle HTML entities in data-powertip', function() {
		var element = $('<a href="#" data-powertip="This <invalid>is</invalid> the <b>tooltip text</b> and <code>{ some: code }</code>"></a>').powerTip();

		openExecCloseAndContinue(element, function() {
			ok($('#powerTip b').length, 'b element was inserted');
			ok($('#powerTip code').length, 'code element was inserted');
			ok($('#powerTip invalid').length, 'invalid element was inserted');
		});
	});

	asyncTest('preserve custom events in powertipjq jQuery data', function() {
		var element = $('<a href="#"></a>'),
			jqObject = $('<b>This is the tooltip text</b>'),
			clickFired = false;

		jqObject.on('click', function() {
			clickFired = true;
		});

		element.data('powertipjq', jqObject);
		element.powerTip();

		openExecCloseAndContinue(element, function() {
			$('#powerTip b').trigger('click');
			deepEqual(clickFired, true, 'click event fired');
		});
	});


	//////////////////// MOUSE SUPPORT TESTS ////////////////////

	module('PowerTip Mouse Support');

	asyncTest('should not show tooltip if the mouse leaves the element before the intent interval', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();

		element.trigger('mouseenter');

		setTimeout(function() {
			element.trigger('mouseleave');
		}, $.fn.powerTip.defaults.intentPollInterval - 50);

		setTimeout(function() {
			deepEqual($('#powerTip').css('display'), 'none', 'display set to none');
			start();
		}, $.fn.powerTip.defaults.intentPollInterval + 50);
	});

	asyncTest('should not show tooltip if the mouse keeps moving', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();

		element.trigger('mouseenter');

		var i = 0, x = 0, y = 0;
		var changeMousePosition = function() {
			if (i < 10) {
				deepEqual($('#powerTip').css('display'), 'none', 'display set to none');

				// move the mouse cursor and run the test again
				x += $.fn.powerTip.defaults.intentSensitivity;
				y += $.fn.powerTip.defaults.intentSensitivity;
				var e = $.Event('mousemove', { pageX: x, pageY: y });
				$(document).trigger(e);
				setTimeout(changeMousePosition, $.fn.powerTip.defaults.intentPollInterval);
			} else {
				// we're done testing
				element.trigger('mouseleave');
				start();
			}

			i++;
		};

		setTimeout(changeMousePosition, $.fn.powerTip.defaults.intentPollInterval);
	});

	asyncTest('tooltip should open on mouse enter and close on mouse leave', function() {
		var element = $('<a href="#" title="This is the tooltip text" style="display:block;position:absolute;top:150px;left:150px;">TESTTESTTEST</a>').powerTip();

		// tell powertip that the mouse is over the element
		var e = $.Event('mousemove', { pageX: element.offset().top, pageY: element.offset().left });
		$(document).trigger(e);

		deepEqual($('#powerTip').css('display'), 'none', 'display set to none');

		element.trigger($.Event('mouseenter', { pageX: element.offset().top, pageY: element.offset().left }));

		setTimeout(function() {
			deepEqual($('#powerTip').css('display'), 'block', 'display set to block');
		}, $.fn.powerTip.defaults.intentPollInterval + 50);

		setTimeout(function() {
			ok($('#powerTip').css('opacity') !== '1', 'tooltip is not faded in');
		}, $.fn.powerTip.defaults.intentPollInterval + $.fn.powerTip.defaults.fadeInTime - 50);

		setTimeout(function() {
			deepEqual($('#powerTip').css('opacity'), '1', 'tooltip is faded in');

			element.trigger('mouseleave');

			setTimeout(function() {
				ok($('#powerTip').css('opacity') !== '0', 'tooltip is not faded out');
			}, $.fn.powerTip.defaults.closeDelay + $.fn.powerTip.defaults.fadeOutTime - 50);

			setTimeout(function() {
				deepEqual($('#powerTip').css('display'), 'none', 'display set to none');
				start();
			}, $.fn.powerTip.defaults.closeDelay + $.fn.powerTip.defaults.fadeOutTime + 50);

		}, $.fn.powerTip.defaults.intentPollInterval + $.fn.powerTip.defaults.fadeInTime + 50);
	});


	//////////////////// KEYBOARD SUPPORT TESTS ////////////////////

	module('PowerTip Keyboard Support');

	asyncTest('tooltips should open when they receive focus and close when they blur', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();

		// tell powertip that the mouse isn't over the element
		// which will appear to be at 0,0 to jQuery
		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		element.trigger('focus');

		deepEqual($('#powerTip').css('display'), 'block', 'display set to block');

		setTimeout(function() {
			ok($('#powerTip').css('opacity') !== '1', 'tooltip is not faded in');
		}, $.fn.powerTip.defaults.fadeInTime - 50);

		setTimeout(function() {
			deepEqual($('#powerTip').css('opacity'), '1', 'tooltip is faded in');

			element.trigger('blur');

			setTimeout(function() {
				ok($('#powerTip').css('opacity') !== '0', 'tooltip is not faded out');
			}, $.fn.powerTip.defaults.fadeOutTime - 50);

			setTimeout(function() {
				deepEqual($('#powerTip').css('display'), 'none', 'display set to none');
				start();
			}, $.fn.powerTip.defaults.fadeOutTime + 50);

		}, $.fn.powerTip.defaults.fadeInTime + 50);
	});

	asyncTest('tooltip should close when escape key is pressed', function() {
		var element = $('<a href="#" title="This is the tooltip text"></a>').powerTip();

		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		$.powerTip.showTip(element);

		deepEqual($('#powerTip').css('display'), 'block', 'display set to block');

		setTimeout(function() {
			ok($('#powerTip').css('opacity') !== '1', 'tooltip is not faded in');
		}, $.fn.powerTip.defaults.fadeInTime - 50);

		setTimeout(function() {
			deepEqual($('#powerTip').css('opacity'), '1', 'tooltip is faded in');

			$(element).trigger($.Event('keydown', { keyCode: 27 }));

			setTimeout(function() {
				ok($('#powerTip').css('opacity') !== '0', 'tooltip is not faded out');
			}, $.fn.powerTip.defaults.fadeOutTime - 50);

			setTimeout(function() {
				deepEqual($('#powerTip').css('display'), 'none', 'display set to none');
				start();
			}, $.fn.powerTip.defaults.fadeOutTime + 50);

		}, $.fn.powerTip.defaults.fadeInTime + 50);

	});


	//////////////////// EVENT TESTS ////////////////////

	module('PowerTip Events');

	asyncTest('all events should fire during the tooltip life cycle', function() {
		expect(9);

		var element = $('<a href="#" title="UNIQUE TOOLTIP TEXT"></a>').powerTip();

		element.on({
			powerTipPreRender: function() {
				ok(true, 'powerTipPreRender fired');
				ok($('#powerTip').text() !== 'UNIQUE TOOLTIP TEXT', 'tooltip content has not been inserted yet');
			},
			powerTipRender: function() {
				ok(true, 'powerTipRender fired');
				deepEqual($('#powerTip').text(), 'UNIQUE TOOLTIP TEXT', 'tooltip content has been inserted');
			},
			powerTipOpen: function() {
				ok(true, 'powerTipOpen fired');
				deepEqual($('#powerTip').css('opacity'), '1', 'tooltip is faded in');
			},
			powerTipClose: function() {
				ok(true, 'powerTipClose fired');
				deepEqual($('#powerTip').text(), 'UNIQUE TOOLTIP TEXT', 'tooltip content still exists');
				deepEqual($('#powerTip').css('display'), 'none', 'display set to none');
			}
		});

		// tell powertip that the mouse isn't over the element
		// which will appear to be at 0,0 to jQuery
		$(document).trigger($.Event('mousemove', { pageX: 50, pageY: 50 }));

		// let the tooltip fully open
		$.powerTip.showTip(element);
		setTimeout(function() {
			// ... then let the tooltip fully close
			$.powerTip.closeTip();
			setTimeout(function() {
				start();
			}, $.fn.powerTip.defaults.fadeOutTime + 50);
		}, $.fn.powerTip.defaults.fadeInTime + 50);
	});

});
