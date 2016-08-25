$(function() {
	'use strict';

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

	// Trapped mouse following tooltip
	$('#trapped-mousefollow').powerTip({ followMouse: true });
});
