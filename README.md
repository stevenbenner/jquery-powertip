# jQuery PowerTip

A jQuery plugin that creates hover tooltips.

## Summary

PowerTip features a very flexible design that is easy to customize, gives you a number of different ways to use the tooltips and supports adding complex data to tooltips. It is being actively developed and maintained, and provides a very fluid user experience.

### Features

* Straightforward implementation
* Simple configuration
* Supports static tooltips as well as tooltips that follow the mouse
* Ability to let users mouse on to the tooltips and interact with their content
* Tests for hover intent
* Mouse follow tooltips are constrained to the browser viewport
* Easy customization
* Smooth fade-ins and fade-outs
* Multiple instances
* Works on any type of element
* Supports complex content (markup with behavior & events)
* Small footprint (only 3kb minified)
* Actively maintained

### Requirements

* jQuery 1.7 or later

## Usage

Running the plugin is about as standard as it gets.

```javascript
$('.tooltips').powerTip(options)
```

Where `options` is an object with the various settings you want to override (all defined below).

For example, if you want to attach tootips to all elements with the "info" class, and have those tooltip appear above and to the right of those elements you would use the following code:

```javascript
$('.info').powerTip({
	placement: 'ne' // north-east tooltip position
});
```

### Setting tooltip content

Generally, if your tooltips are just plain text then you probably want to set your tooltip text with the HTML title attribute on the elements themselves. This approach is very intuitive and backwards compatible. But there are several ways to specify the content.

#### Title attribute

The simplest method, as well as the only one that will continue to work for users who have JavaScript disabled in their browsers.

```html
<a href="/some/link" title="This will be the tooltip text.">Some Link</a>
```

#### data-powertip

Basically the same as setting the title attribute, but using an HTML5 data attribute. You can set this in the markup or with JavaScript at any time. It only accepts a simple string, but that string can contain markup.

```javascript
$('#element').data('powertip', 'This will be the <b>tooltip text</b>.');
```

or

```html
<a href="/some/link" data-powertip="This will be the &lt;b&gt;tooltip text&lt;/b&gt;.">Some Link</a>
```

#### data-powertipjq

This is a data interface that will accept a jQuery object. You can create a jQuery object containing complex markup (and even events) and attach it to the element via jQuery's `.data()` method at any time.

```javascript
var tooltip = $('<div>This will be the tooltip text. It even has an onclick event!</div>');
tooltip.on('click', function() { /* ... */ });

$('#element').data('powertipjq', tooltip);
```

#### data-powertiptarget

You can specify the ID of an element in the DOM to pull the content from. PowerTip will replicate the markup of that element in the tooltip without modifying or destroying the original.

```html
<div id="myToolTip">
	<p><b>Some Title</b></p>
	<p>This will be the tooltip text.</p>
	<p><a href="#">This link will be in the tooltip as well.</a></p>
</div>
```

```javascript
$('#element').data('powertiptarget', 'myToolTip');
```

## Options

The tooltip behavior is determined by a series of options that you can override. You can pass the options as an object directly to the plugin as an argument when you call it. For example:

```javascript
$('.tips').powerTip({
	option1: 'value',
	option2: 'value',
	option3: 'value'
});
```

The settings will only apply to those tooltips matched in the selector. This means that you can have different sets of tooltips on the same page with different options. For example:

```javascript
$('.tips').powerTip(/** options for regular tooltips **/);

$('.specialTips').powerTip(/** options for special tooltips **/);
```

You can change the default options for all tooltips by setting their values in the `$.fn.powerTip.defaults` object before you call `powerTip()`. For example:

```javascript
// change the default tooltip placement to south
$.fn.powerTip.defaults.placement = 's';

$('.tips').powerTip(); // these tips will appear underneath the element
```

Of course those defaults will be overridden with any options you pass directly to the `powerTip()` call.

### List of options

| Name | Default | Type | Description |
| ----- | ----- | ----- | ----- |
| `followMouse` | `false` | Boolean | If set to `true` the tooltip will follow the users mouse cursor. |
| `mouseOnToPopup` | `false` | Boolean | Allow the mouse to hover on the tooltip. This lets users interact with the content in the tooltip. Only works if `followMouse` is set to `false`. |
| `placement` | `'n'` | String | Placement location of the tooltip relative to the element it is open for. Values can be `n`, `e`, `s`, `w`, `nw`, `ne`, `sw`, or `se` (as in north, east, south, and west). This only matters if `followMouse` is set to `false`. |
| `popupId` | `'powerTip'` | String | HTML id attribute for the tooltip div. |
| `offset` | `10` | Number | Pixel offset of the tooltip. This will be the offset from the element the tooltip is open for, or from from mouse cursor if `followMouse` is `true`. |
| `fadeInTime` | `200` | Number | Tooltip fade-in time in milliseconds. |
| `fadeOutTime` | `100` | Number | Tooltip fade-out time in milliseconds. |
| `closeDelay` | `100` | Number | Time in milliseconds to wait after mouse cursor leaves the element before closing the tooltip. |
| `intentPollInterval` | `100` | Number | Hover intent polling interval in milliseconds. |
| `intentSensitivity` | `7` | Number | Hover intent sensitivity. The tooltip will not open unless the number of pixels the mouse has moved within the `intentPollInterval` is less than this value. These default values mean that if the mouse cursor has moved 7 or more pixels in 100 milliseconds the tooltip will not open. |

## Similar Projects

There are many other great JavaScript tooltip projects that are worth taking a look at and may better suit your needs. Here is a list of some of my favorite jQuery tooltip plugins:

* [tipsy](https://github.com/jaz303/tipsy/)
* [qTip2](https://github.com/Craga89/qTip2)
* [TipTip](https://github.com/drewwilson/TipTip)
* [clueTip](https://github.com/kswedberg/jquery-cluetip)

## License

*(This project is released under the [MIT license](https://raw.github.com/stevenbenner/jquery-powertip/master/LICENSE.txt).)*

Copyright (c) 2012 Steven Benner, http://stevenbenner.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
