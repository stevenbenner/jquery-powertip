## Tooltip CSS

PowerTip includes some base CSS that you can just add to your site and be done with it, but you may want to change the styles or even craft your own styles to match your design. PowerTip is specifically designed to give you full control of your tooltips with CSS, with just a few basic requirements.

I recommend that you either adapt one of the base stylesheets to suit your needs or override its rules so that you don't forget anything.

**Important notes:**

* The default id of the PowerTip element is `powerTip`. But this can be changed via the `popupId` option.
* The PowerTip element is always a direct child of body, appended after all other content on the page.
* The tooltip element is not created until you run `powerTip()`.
* PowerTip will set the `display`, `visibility`, `opacity`, `top`, `left`, and `right` properties using inline styles.

### CSS requirements

The bare minimum that PowerTip requires to work is that the `#powerTip` element be given absolute positioning and set to not display. For example:

```css
#powerTip {
	position: absolute;
	display: none;
}
```

### CSS recommendations

#### High z-index

You will want your tooltips to display over all other elements on your web page. This is done by setting the z-index value to a number greater than the z-index of any other elements on the page. It's probably a good idea to just set the z-index for the tooltip element to the maximum integer value (2147483647). For example:

```css
#powerTip {
	z-index: 2147483647;
}
```

#### CSS arrows

You probably want to create some CSS arrows for your tooltips (unless you only use mouse-follow tooltips). This topic would be an article unto itself, so if you want to make your own CSS arrows from scratch you should just Google "css arrows" to see how it's done.

CSS arrows are created by using borders of a specific color and transparent borders. PowerTip adds the arrows by creating an empty `:before` pseudo element and absolutely positioning it around the tooltip.

#### Fixed width

It is recommend, but not required, that tooltips have a static width. PowerTip is designed to work with elastic tooltips, but it can look odd if you have huge tooltips so it is probably best for you to set a width on the tooltip element or (if you have short tooltip text) disable text wrapping. For example:

```css
#powerTip {
	width: 300px;
}
```

or

```css
#powerTip {
	white-space: nowrap;
}
```
