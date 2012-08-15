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

	// Disabled input
	$('#disabled-input input').powerTip({ placement: 'e' });

	// Trapped mouse following tooltip
	$('#trapped-mousefollow').powerTip({ followMouse: true });

});
