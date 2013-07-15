$(function() {
	// placement examples
	$('#north').powerTip({ placement: 'n' });
	$('#east').powerTip({ placement: 'e' });
	$('#south').powerTip({ placement: 's' });
	$('#west').powerTip({ placement: 'w' });
	$('#north-west').powerTip({ placement: 'nw' });
	$('#north-east').powerTip({ placement: 'ne' });
	$('#south-west').powerTip({ placement: 'sw' });
	$('#south-east').powerTip({ placement: 'se' });
	$('#north-west-alt').powerTip({ placement: 'nw-alt' });
	$('#north-east-alt').powerTip({ placement: 'ne-alt' });
	$('#south-west-alt').powerTip({ placement: 'sw-alt' });
	$('#south-east-alt').powerTip({ placement: 'se-alt' });

	// mouse follow examples
	$('#mousefollow-examples div').powerTip({ followMouse: true });

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

	// project page tooltips
	$('#buttons a').data('powertip', 'Everything you need!');
	$('#buttons a').powerTip({ placement: 'e' });
	$('#footer a').powerTip();

	// ga download event
	$('#download-link').on('click', function() {
		_gaq.push(['_trackEvent', 'Download', 'PowerTip', this.href]);
	});

	// add contributors list
	var contribList = $('#contributors');
	$.ajax({
		url: 'https://api.github.com/repos/stevenbenner/jquery-powertip/contributors',
		type: 'GET',
		dataType: 'jsonp',
		cache: false
	}).done(function(data) {
		var list, anchor;
		if (data.data && data.data.length) {
			list = $('<ul />');
			$.each(data.data, function(idx, user) {
				anchor = $('<a />').attr('href', user.html_url).attr('target', '_blank').attr('rel', 'external').text(user.login);
				list.append($('<li />').append(anchor));
			});
			list.insertAfter(contribList.next());
		}
	});
});
