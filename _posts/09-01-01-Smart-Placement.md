## About smart placement

Smart placement is a feature that will attempt to keep non-mouse-follow tooltips within the browser view port. When it is enabled PowerTip will automatically change the placement of any tooltip that would appear outside of the view port, such as a tooltip that would push outside the left or right bounds of the window, or a tooltip that would be hidden below the fold.

**Without smart placement:**

![Example without smart placement](http://stevenbenner.github.com/jquery-powertip/images/without-smart-placement.png)

**With smart placement:**

![Example with smart placement](http://stevenbenner.github.com/jquery-powertip/images/with-smart-placement.png)

It does this by detecting that a tooltip would appear outside of the view port, then trying a series of other placement options until it finds one that isn't going to be outside of the view port. You can define the placement fall backs and priorities yourself by overriding them in the `$.fn.powerTip.smartPlacementLists` object.

These are the default smart placement priority lists: 

{% highlight javascript %}
$.fn.powerTip.smartPlacementLists = {
	n: ['n', 'ne', 'nw', 's'],
	e: ['e', 'ne', 'se', 'w', 'nw', 'sw', 'n', 's', 'e'],
	s: ['s', 'se', 'sw', 'n'],
	w: ['w', 'nw', 'sw', 'e', 'ne', 'se', 'n', 's', 'w'],
	nw: ['nw', 'w', 'sw', 'n', 's', 'se', 'nw'],
	ne: ['ne', 'e', 'se', 'n', 's', 'sw', 'ne'],
	sw: ['sw', 'w', 'nw', 's', 'n', 'ne', 'sw'],
	se: ['se', 'e', 'ne', 's', 'n', 'nw', 'se']
};
{% endhighlight %}

As you can see, each placement option has an array of placement options that it can fall back on. The first item in the array is the highest priority placement, the last is the lowest priority. The last item in the array is also the default. If none of the placement options can be fully displayed within the view port then the last item in the array is the placement used to show the tooltip.

You can override these default placement priority lists before you call `powerTip()` and define your own smart placement fall back order. Like so:

{% highlight javascript %}
// define custom smart placement order
$.fn.powerTip.smartPlacementLists.n = ['n', 's', 'e', 'w'];

// these tips will use the custom 'north' smart placement list
$('.tips').powerTip({
	placement: 'n',
	smartPlacement: true
});
{% endhighlight %}

Smart placement is **disabled** by default because I believe that the world would be a better place if features that override explicit configuration values were disabled by default.
