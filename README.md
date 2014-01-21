KerningPairs.js
===============

This script was written to test and improve a new syntax for manual control over kerning in web typography. When this script is implemented you can add the `kerning-pairs` property in your CSS styles, as if it was a valid style.

If you have any suggestions of how to improve the syntax, or how it might fall over, please feel free to contribute!

## Setup

Add kerningpairs.js at the end of your HTML page, just before the closing `body` tag.

```HTML
	…
	
	<script src="./path-to-js/kerningpairs.js" type="text/javascript"></script>
		
</body>
</html>
```

Now you can start manually adjusting kerning in your own CSS.

## CSS Syntax

The syntax is simple:

```CSS
kerning-pairs: [first character][second character] distance[ , [first character][second character] distance]* ;
```

An example implementation:

```CSS
h1 {
	kerning-pairs: az 0.02em,
					zy 0.01em,
					th 0.01em,
					ov -0.02em,
					ox -0.04em,
					og 0.005em,
					x  -0.04em,
					y  -0.04em;
}
```

## This script is a Stylefill

A ‘Stylefill’ is a way to create new CSS properties using JavaScript. Stylefills are similar in concept to a [polyfill](http://remysharp.com/2010/10/08/what-is-a-polyfill/), but are only focussed on extending CSS in new ways, and [Stylefill.js](https://github.com/nathanford/stylefill/) is a library to help make it much easier.

## Support

KerningPairs.js should work in all modern browsers, and IE9+.