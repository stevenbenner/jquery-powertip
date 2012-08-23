$(function() {

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

	// Huge text
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
	$('.north, .east, .south, .west, .north-west, .north-east, .south-west, .south-east')
		.data('powertip', hugeText);
	$('#huge-text .north').powerTip({placement: 'n'});
	$('#huge-text .east').powerTip({placement: 'e'});
	$('#huge-text .south').powerTip({placement: 's'});
	$('#huge-text .west').powerTip({placement: 'w'});
	$('#huge-text .north-west').powerTip({placement: 'nw'});
	$('#huge-text .north-east').powerTip({placement: 'ne'});
	$('#huge-text .south-west').powerTip({placement: 'sw'});
	$('#huge-text .south-east').powerTip({placement: 'se'});

	// Huge text with smart placement
	$('#huge-text-smart .north').powerTip({placement: 'n', smartPlacement: true});
	$('#huge-text-smart .east').powerTip({placement: 'e', smartPlacement: true});
	$('#huge-text-smart .south').powerTip({placement: 's', smartPlacement: true});
	$('#huge-text-smart .west').powerTip({placement: 'w', smartPlacement: true});
	$('#huge-text-smart .north-west').powerTip({placement: 'nw', smartPlacement: true});
	$('#huge-text-smart .north-east').powerTip({placement: 'ne', smartPlacement: true});
	$('#huge-text-smart .south-west').powerTip({placement: 'sw', smartPlacement: true});
	$('#huge-text-smart .south-east').powerTip({placement: 'se', smartPlacement: true});

	// Trapped mouse following tooltip
	$('#trapped-mousefollow').powerTip({ followMouse: true });

});
