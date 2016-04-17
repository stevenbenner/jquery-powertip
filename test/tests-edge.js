$(function() {
	'use strict';

	// Open on load
	$('#open-on-load input').powerTip({ placement: 'ne' }).powerTip('show');

	// Click toggle
	$('#click-toggle input').powerTip({
		openEvents: [ 'click' ],
		closeEvents: [ 'click' ],
		placement: 'e'
	});

	// Remote target
	$('#remote-target a').powerTip({ placement: 'ne' });
	$('#remote-target input').on('click', function() {
		$('#remote-target a').powerTip('show');
	});

	// Self-disabling button
	$('#disable-button input').on('click', function() {
		var $this = $(this);
		$this.attr('disabled', true);
		// enable after 2 seconds
		setTimeout(function() {
			$this.attr('disabled', false);
		}, 2000);
	});
	$('#disable-button input').powerTip({ placement: 'e' });

	// Auto-disabling button
	$('#auto-disable-button input').on('mouseenter focus', function() {
		var button = $(this);
		setTimeout(function() {
			button.attr('disabled', true);
			// enable after 2 seconds
			setTimeout(function() {
				button.attr('disabled', false);
			}, 2000);
		}, 2000);
	});
	$('#auto-disable-button input').powerTip({ placement: 'e' });

	// Long delay tooltips
	$('#long-delay #first-button').powerTip({ closeDelay: 2000, mouseOnToPopup: true });
	$('#long-delay #second-button').powerTip({ closeDelay: 2000 });

	// Manual and interactive tooltips
	$('#manual-and-interactive #manual-button').on('click', function() {
		$(this).powerTip('toggle');
	}).powerTip({ manual: true });
	$('#manual-and-interactive #interactive-button').powerTip({ mouseOnToPopup: true });

	// setup huge text tooltips
	var hugeText = [
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed',
		'volutpat tellus. Fusce mollis iaculis est at sodales. Proin aliquam',
		'bibendum neque, nec blandit orci porttitor non. Cras lacinia varius',
		'felis vel ultricies. Nulla eu sapien arcu, dapibus tempor eros.',
		'Praesent aliquet hendrerit commodo. Pellentesque habitant morbi',
		'tristique senectus et netus et malesuada fames ac turpis egestas.',
		'Proin gravida justo faucibus urna dictum id egestas velit hendrerit.',
		'Praesent dapibus rutrum tempor. Sed ultrices varius purus, eu rhoncus',
		'tortor scelerisque sit amet. Sed vitae molestie diam. Pellentesque',
		'posuere euismod venenatis. Proin ut ligula vel urna lacinia accumsan.',
		'Quisque commodo ultrices orci ut cursus. Aliquam in dolor orci. Nunc',
		'pretium euismod odio.'
	].join(' ');
	$.each(
		[
			'north',
			'east',
			'south',
			'west',
			'north-west',
			'north-east',
			'south-west',
			'south-east',
			'north-west-alt',
			'north-east-alt',
			'south-west-alt',
			'south-east-alt'
		],
		function(i, val) {
			$('.' + val).data('powertip', hugeText);
		}
	);

	// Huge text
	$('#huge-text .north').powerTip({ placement: 'n' });
	$('#huge-text .east').powerTip({ placement: 'e' });
	$('#huge-text .south').powerTip({ placement: 's' });
	$('#huge-text .west').powerTip({ placement: 'w' });
	$('#huge-text .north-west').powerTip({ placement: 'nw' });
	$('#huge-text .north-east').powerTip({ placement: 'ne' });
	$('#huge-text .south-west').powerTip({ placement: 'sw' });
	$('#huge-text .south-east').powerTip({ placement: 'se' });
	$('#huge-text .north-west-alt').powerTip({ placement: 'nw-alt' });
	$('#huge-text .north-east-alt').powerTip({ placement: 'ne-alt' });
	$('#huge-text .south-west-alt').powerTip({ placement: 'sw-alt' });
	$('#huge-text .south-east-alt').powerTip({ placement: 'se-alt' });

	// Huge text with smart placement
	$('#huge-text-smart .north').powerTip({ placement: 'n', smartPlacement: true });
	$('#huge-text-smart .east').powerTip({ placement: 'e', smartPlacement: true });
	$('#huge-text-smart .south').powerTip({ placement: 's', smartPlacement: true });
	$('#huge-text-smart .west').powerTip({ placement: 'w', smartPlacement: true });
	$('#huge-text-smart .north-west').powerTip({ placement: 'nw', smartPlacement: true });
	$('#huge-text-smart .north-east').powerTip({ placement: 'ne', smartPlacement: true });
	$('#huge-text-smart .south-west').powerTip({ placement: 'sw', smartPlacement: true });
	$('#huge-text-smart .south-east').powerTip({ placement: 'se', smartPlacement: true });
	$('#huge-text-smart .north-west-alt').powerTip({ placement: 'nw-alt', smartPlacement: true });
	$('#huge-text-smart .north-east-alt').powerTip({ placement: 'ne-alt', smartPlacement: true });
	$('#huge-text-smart .south-west-alt').powerTip({ placement: 'sw-alt', smartPlacement: true });
	$('#huge-text-smart .south-east-alt').powerTip({ placement: 'se-alt', smartPlacement: true });

	// SVG elements
	$('#svg-elements #red-ellipse1').powerTip({ placement: 'n' });
	$('#svg-elements #red-ellipse2').powerTip({ placement: 'e' });
	$('#svg-elements #red-ellipse3').powerTip({ placement: 's' });
	$('#svg-elements #red-ellipse4').powerTip({ placement: 'w' });
	$('#svg-elements #red-ellipse5').powerTip({ placement: 'nw' });
	$('#svg-elements #red-ellipse5-alt').powerTip({ placement: 'nw-alt' });
	$('#svg-elements #red-ellipse6').powerTip({ placement: 'ne' });
	$('#svg-elements #red-ellipse6-alt').powerTip({ placement: 'ne-alt' });
	$('#svg-elements #red-ellipse7').powerTip({ placement: 'sw' });
	$('#svg-elements #red-ellipse7-alt').powerTip({ placement: 'sw-alt' });
	$('#svg-elements #red-ellipse8').powerTip({ placement: 'se' });
	$('#svg-elements #red-ellipse8-alt').powerTip({ placement: 'se-alt' });
	$('#svg-elements #red-ellipse9').powerTip({ placement: 'n' });

	// Complex SVG elements
	$('#complex-svg-elements #black-star').powerTip({ placement: 'n' });
	$('#complex-svg-elements #black-line').powerTip({ placement: 'e' });
	$('#complex-svg-elements #black-mexico').powerTip({ placement: 's' });
	$('#complex-svg-elements #black-group').powerTip({ placement: 'w' });
	$('#complex-svg-elements #black-circle').powerTip({ placement: 'nw' });
	$('#complex-svg-elements #black-rect').powerTip({ placement: 'ne' });
	$('#complex-svg-elements #black-polygon').powerTip({ placement: 'sw' });
	$('#complex-svg-elements #black-text').powerTip({ placement: 'se' });

	// Rotated SVG elements
	$('#rotated-svg-elements #blue-ellipse1').powerTip({ placement: 'nw' });
	$('#rotated-svg-elements #blue-ellipse2').powerTip({ placement: 'n' });
	$('#rotated-svg-elements #blue-ellipse3').powerTip({ placement: 'ne' });
	$('#rotated-svg-elements #blue-ellipse4').powerTip({ placement: 'w' });
	$('#rotated-svg-elements #blue-ellipse5').powerTip({ followMouse: true });
	$('#rotated-svg-elements #blue-ellipse6').powerTip({ placement: 'e' });
	$('#rotated-svg-elements #blue-ellipse7').powerTip({ placement: 'sw' });
	$('#rotated-svg-elements #blue-ellipse8').powerTip({ placement: 's' });
	$('#rotated-svg-elements #blue-ellipse9').powerTip({ placement: 'se' });

	// Trapped mouse following tooltip
	$('#trapped-mousefollow').powerTip({ followMouse: true });
});
