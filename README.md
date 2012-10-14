# PowerTip [![Build Status](https://secure.travis-ci.org/stevenbenner/jquery-powertip.png)](http://travis-ci.org/stevenbenner/jquery-powertip)

*A jQuery plugin that creates hover tooltips.*

## Change Log

**[v1.2.0](https://github.com/stevenbenner/jquery-powertip/compare/v1.1.0...master)** - TBD

* Mouse-follow tooltips will now flip out of the way if they become trapped in the bottom-right corner.
* Escape key will now close tooltip for selected element.
* Added several alternative tooltip CSS themes.
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

Copyright (c) 2012 Steven Benner, http://stevenbenner.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
