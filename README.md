# jQuery PowerTip

A jQuery plugin that creates hover tooltips.

## Summary

This plugin will create tooltips for you. Of course there are already about 5 million jQuery plugins that can create tooltips, but none of them had all of the features I wanted and worked the way I wanted, so I created my own. Here is yet another tooltip plugin for jQuery.

PowerTip features a very flexible design that is easy to customize, gives you a number of different ways to use the tooltips and supports adding complex data to tooltips. It is being actively developed and maintained, and provides a very fluid user experience.

### Features

* Straightforward implementation (just include script, a few lines of CSS and call `powerTip()`)
* Simple configuration
* Supports static tooltips as well as tooltips that follow the mouse
* Ability to let users mouse on to the tooltips and interact with their content
* Tests for hover intent (users have to hold the mouse cursor on the element before the tooltip will open)
* Mouse follow tooltips are constrained to the browser viewport
* Easy customization

### Requirements

* jQuery core, version 1.7 or later.

## Usage

Running the plugin is about as standard as it gets.
```javascript
$('.tooltips').powerTip(options)
```
Where `options` is an object with the various settings you want to override (all defined below).

### Setting tooltip content

Generally, you probably want to set your tooltip text with the HTML title attribute on the elements themselves. This approach is very intuitive and backwards compatible. But there are several ways to specify the content.

#### Title attribute

The simplest method, as well as the only one that will continue to work for users who have JavaScript disabled in their browsers.

```html
<a href="/some/link" title="This will be the tooltip text.">Some Link</a>
```

#### data-powertip

Basically the same as tooltip, but an HTML5 data attribute. You can set this in the markup or with JavaScript at an time. It only accepts a simple string.

```html
<a href="/some/link" data-powertip="This will be the tooltip text.">Some Link</a>
```

or

```javascript
$('#element').data('powertip', 'This will be the tooltip text.');
```

#### data-powertipjq

This is a data interface that will accept a jQuery object. You can create a jQuery object containing complex markup (and even events) and attach it to the element via jQuery's `.data()` method at any time.

```javascript
var tooltip = $('<div>This will be the tooltip text.</div>');
tooltip.on('click', function() { /* ... */ });

$('#element').data('powertipjq', tooltip);
```

#### data-powertiptarget

You can specify the ID of an element in the DOM to pull the content from. PowerTip will replicate the markup inside of that element in the tooltip without modifying or destroying the original.

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

## License

*(This project is released under the [MIT license](https://raw.github.com/stevenbenner/jquery-powertip/master/LICENSE.txt).)*

Copyright (c) 2012 Steven Benner, http://stevenbenner.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
