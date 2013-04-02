---
layout: default
description: "PowerTip is a jQuery plugin for creating smooth, modern tooltips."
---

PowerTip features a very flexible design that is easy to customize, gives you a number of different ways to use the tooltips, has APIs for developers, and supports adding complex data to tooltips. It is being actively developed and maintained, and provides a very fluid user experience.

<p id="buttons">
<a href="releases/jquery.powertip-<%= pkg.version %>.zip" class="button" id="download-link">Download v<%= pkg.version %></a>
<span>Zip file with examples, CSS, and script.</span>
</p>

Here are some basic examples of PowerTip in actions. You can also fiddle with PowerTip on the official [jsFiddle demo](http://jsfiddle.net/stevenbenner/2baqv/).

### Placement examples

<div id="placement-examples">
<div>
<input type="button" id="north-west" value="North West" title="North west placement {placement: 'nw'}" />
<input type="button" id="north" value="North" title="North placement {placement: 'n'}" />
<input type="button" id="north-east" value="North East" title="North east placement {placement: 'ne'}" /><br />
<input type="button" id="west" value="West" title="West placement {placement: 'w'}" />
<input type="button" id="east" value="East" title="East placement {placement: 'e'}" /><br />
<input type="button" id="south-west" value="South West" title="South west placement {placement: 'sw'}" />
<input type="button" id="south" value="South" title="South placement {placement: 's'}" />
<input type="button" id="south-east" value="South East" title="South east placement {placement: 'se'}" />
</div>
</div>

### Mouse follow example

<div id="mousefollow-examples">
<div title="Mouse follow {followMouse: true}">
The PowerTip for this box will follow the mouse.
</div>
</div>

### Mouse on to popup example

<div id="mouseon-examples">
<div>
The PowerTip for this box will appear on the right and you will be able to interact with its content.
</div>
</div>

<%=
	doc.replace(
		/```(\w+)((?:.*\r?\n)*?)```/g,
		'{% highlight $1 %}$2{% endhighlight %}'
	)
%>

## Change Log
<%
	_.each(changelog, function(details, version) {
		var date = details.date;

		if (date instanceof Date) {
			date = grunt.template.date(new Date(date.getTime() + date.getTimezoneOffset() * 60000), 'longDate');
		}

		if (details.diff) {
			print('\n\n### [' + version + '](' + details.diff + ')');
		} else {
			print('\n\n### ' + version);
		}
		print(' - ' + details.description + ' (' + date + ')\n');

		_.each(details.changes, function(value, key, list) {
			print('\n* **' + value.section + '**');
			_.each(value.changes, function(value, key, list) {
				print('\n\t* ' + value);
			});
		});
	});
%>
