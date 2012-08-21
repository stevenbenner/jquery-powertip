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

	// Trapped mouse following tooltip
	$('#trapped-mousefollow').powerTip({ followMouse: true });

});
