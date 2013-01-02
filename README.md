# [PowerTip][projectpage] - A jQuery plugin that creates hover tooltips.

PowerTip is a jQuery tooltip plugin with some advanced features like **hover intent testing**, **tooltip queueing**, and **support for complex data**. It also has that rarest of features in jQuery plugins, it's not abandonware.

[![Build Status](https://secure.travis-ci.org/stevenbenner/jquery-powertip.png)](http://travis-ci.org/stevenbenner/jquery-powertip)

## Getting Started

* Download the latest stable release from the [PowerTip web site][projectpage].
* Add the js and css references to your web site.
* Add a title or data-powertip attribute to the elements you want to show tooltips for.
* Run the `powerTip()` method on those elements.

## Documentation

You can find the documentation for the **latest release version** on the [PowerTip web site][projectpage]. You will find the documentation for the **latest in-development version** in the [doc folder][docs] in this repository.

[projectpage]: http://stevenbenner.github.com/jquery-powertip/
[docs]: https://github.com/stevenbenner/jquery-powertip/tree/master/doc

## Reporting Bugs

For bug reports, questions, feature requests, or other suggestions the best way to contact me is to [create an issue][newissue] on GitHub. If you don't want to use GitHub or want to contact me about something else please feel free to contact me via twitter at [@stevenbenner][twitter]. As with all open source projects: pull request > bug report > tweet.

[newissue]: https://github.com/stevenbenner/jquery-powertip/issues/new
[twitter]: https://twitter.com/stevenbenner

## Contributor Guide

Make PowerTip better! Join the [leage of awesome][contributors] today by submitting a patch! The best way to submit patches is to [fork this project][fork] on GitHub and submit a pull request. But if you are unwilling or unable to use GitHub I will accept patches in any way you can get them to me (jsFiddle, pastebin, text file, whatever).

[contributors]: https://github.com/stevenbenner/jquery-powertip/graphs/contributors
[fork]: https://github.com/stevenbenner/jquery-powertip/fork

### Style Guide

These are general guidelines, not rules. I won't refuse a pull request just because it isn't the exact style that I use.

* Style guide: In general, follow the [Google JavaScript Style Guide][styleguide].
* Line wrap: Soft-wrap at 80 characters (go further if wrapping makes code less readable).
* Indentation: Use tabs for indentation.
* JSDoc comments: Use [closure compiler annotations][jsdoc].
* Method chaining: Avoid long chained method statements, two or three max.

[styleguide]: https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
[jsdoc]: https://developers.google.com/closure/compiler/docs/js-for-compiler

## Change Log

**[v1.2.0](https://github.com/stevenbenner/jquery-powertip/compare/v1.1.0...master)** - TBD

* Mouse-follow tooltips will now flip out of the way if they become trapped in the bottom-right corner.
* Escape key will now close tooltip for selected element.
* Added 8 new tooltip CSS themes.
* Added support for elastic tooltips.
* Added reposition() method to the API.
* Added destroy() method to the API.
* Added manual option to disable the built-in event listeners.
* Added nw-alt, ne-alt, sw-alt, and se-alt placement options.
* Added support for SVG elements.
* Changed default z-index in CSS themes to int max.
* Data attributes powertip and powertipjq now accept a function.
* powerTip() will now overwrite any previous powerTip() calls on an element.
* You can now pass API method names as strings to the `powerTip()` function.
* Fixed bug that would cause the CSS position to be updated even when the tooltip is closed.
* Fixed issue that could cause tooltips to close prematurely during the closeDelay period.
* showTip and hideTip API methods are now aliases of the new show and hide API methods.

**[v1.1.0](https://github.com/stevenbenner/jquery-powertip/compare/v1.0.4...v1.1.0)** - August 8, 2012

* Added smart placement feature.
* Added API with showTip() and closeTip() methods.
* Added custom events.
* Added support for keyboard navigation.
* Added support for jsFiddle.
* Fixed mouse-follow constraint.

**[v1.0.4](https://github.com/stevenbenner/jquery-powertip/compare/v1.0.3...v1.0.4)** - July 31, 2012

* Fixed problems with Internet Explorer 8.

**[v1.0.3](https://github.com/stevenbenner/jquery-powertip/compare/v1.0.2...v1.0.3)** - July 31, 2012

* Added mouse position tracking to scroll events.
* Fixed rare issue that would make fixed placement tooltips follow the mouse.

**[v1.0.2](https://github.com/stevenbenner/jquery-powertip/compare/v1.0.1...v1.0.2)** - July 26, 2012

* Added placement class to tooltip element.
* Added CSS arrows to tooltips.
* Add nw, ne, sw, and sw placement options.
* Changed default closeDelay to 100ms.
* Changed default fadeOutTime to 100ms.
* Changed default placement to north.
* Fixed error when there is no tooltip content.
* Fixed rare error when moused entered a tooltip during its fadeOut cycle.

**[v1.0.1](https://github.com/stevenbenner/jquery-powertip/compare/v1.0.0...v1.0.1)** - July 11, 2012

* Fixed rare issue that caused tooltips to become desynced.

**v1.0.0** - July 1, 2012

* Initial release.

## License

*(This project is released under the [MIT license](https://raw.github.com/stevenbenner/jquery-powertip/master/LICENSE.txt).)*

Copyright (c) 2012 Steven Benner (http://stevenbenner.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
