$(function() {
	// placement examples
	$('#north').powerTip({placement: 'n'});
	$('#east').powerTip({placement: 'e'});
	$('#south').powerTip({placement: 's'});
	$('#west').powerTip({placement: 'w'});
	$('#north-west').powerTip({placement: 'nw'});
	$('#north-east').powerTip({placement: 'ne'});
	$('#south-west').powerTip({placement: 'sw'});
	$('#south-east').powerTip({placement: 'se'});

	// mouse follow examples
	$('#mousefollow-examples div').powerTip({followMouse: true});

	// mouse-on examples
	$('#mouseon-examples div').data('powertipjq', $([
		'<p><b>Here is some content</b></p>',
		'<p><a href="http://stevenbenner.com/">Maybe a link</a></p>',
		'<p>{ placement: \'e\', mouseOnToPopup: true }</p>'
	].join('\n')));
	$('#mouseon-examples div').powerTip({
		placement: 'e',
		mouseOnToPopup: true
	});
	$('.twitter-share-button').data('powertip', 'Sharing is caring!');
	$('.twitter-share-button').powerTip({placement: 'w'});
	$('#buttons a').data('powertip', 'Everything you need!');
	$('#buttons a').powerTip({placement: 'e'});
	$('#footer a').powerTip();

	// ga download event
	$('#download-link').on('click', function() {
		var _gaq = _gaq || [];
		_gaq.push(['_trackEvent', 'Downloads', 'PowerTip Release Version']);
	});
});
