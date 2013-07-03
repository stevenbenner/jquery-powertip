/**
 * PowerTip PlacementCalculator
 *
 * @fileoverview  PlacementCalculator object that computes tooltip position.
 * @link          http://stevenbenner.github.com/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @requires      jQuery 1.7+
 */

/**
 * Creates a new Placement Calculator.
 * @private
 * @constructor
 */
function PlacementCalculator() {
	/**
	 * Compute the CSS position to display a tooltip at the specified placement
	 * relative to the specified element.
	 * @private
	 * @param {jQuery} element The element that the tooltip should target.
	 * @param {string} placement The placement for the tooltip.
	 * @param {number} tipWidth Width of the tooltip element in pixels.
	 * @param {number} tipHeight Height of the tooltip element in pixels.
	 * @param {number} offset Distance to offset tooltips in pixels.
	 * @return {CSSCoordinates} A CSSCoordinates object with the position.
	 */
	function computePlacementCoords(element, placement, tipWidth, tipHeight, offset) {
		var placementBase = placement.split('-')[0], // ignore 'alt' for corners
			coords = new CSSCoordinates(),
			position;

		if (isSvgElement(element)) {
			position = getSvgPlacement(element, placementBase);
		} else if (element.css('transform').indexOf('matrix') !== -1) {
			position = getTransformedHtmlPlacement(element, placementBase);
		} else {
			position = getHtmlPlacement(element, placementBase);
		}

		// calculate the appropriate x and y position in the document
		switch (placement) {
		case 'n':
			coords.set('left', position.left - (tipWidth / 2));
			coords.set('bottom', session.windowHeight - position.top + offset);
			break;
		case 'e':
			coords.set('left', position.left + offset);
			coords.set('top', position.top - (tipHeight / 2));
			break;
		case 's':
			coords.set('left', position.left - (tipWidth / 2));
			coords.set('top', position.top + offset);
			break;
		case 'w':
			coords.set('top', position.top - (tipHeight / 2));
			coords.set('right', session.windowWidth - position.left + offset);
			break;
		case 'nw':
			coords.set('bottom', session.windowHeight - position.top + offset);
			coords.set('right', session.windowWidth - position.left - 20);
			break;
		case 'nw-alt':
			coords.set('left', position.left);
			coords.set('bottom', session.windowHeight - position.top + offset);
			break;
		case 'ne':
			coords.set('left', position.left - 20);
			coords.set('bottom', session.windowHeight - position.top + offset);
			break;
		case 'ne-alt':
			coords.set('bottom', session.windowHeight - position.top + offset);
			coords.set('right', session.windowWidth - position.left);
			break;
		case 'sw':
			coords.set('top', position.top + offset);
			coords.set('right', session.windowWidth - position.left - 20);
			break;
		case 'sw-alt':
			coords.set('left', position.left);
			coords.set('top', position.top + offset);
			break;
		case 'se':
			coords.set('left', position.left - 20);
			coords.set('top', position.top + offset);
			break;
		case 'se-alt':
			coords.set('top', position.top + offset);
			coords.set('right', session.windowWidth - position.left);
			break;
		}

		return coords;
	}

	/**
	 * Calculates the size of the rotated-element's bounding box.
	 * @private
	 * @param {jQuery} element The possibly rotated element.
	 * @return {Object} An object with the width,height position values.
	 */
	function getTransformedHtmlDimensions(element) {
		var cos,
			sin,
			width = element.width(),
			height = element.height(),
			matrix = element.css('transform').replace(/matrix\(|\)/g, '').split(', ');
		cos = matrix[0];
		sin = matrix[1];
		return {
			'width': Math.round(width * Math.abs(cos) + height * Math.abs(sin)),
			'height': Math.round(width * Math.abs(sin) + height * Math.abs(cos))
		};
	}

	/**
	 * Finds the tooltip attachment point in the document for a css
	 * transformed HTML DOM element for the specified placement.
	 * @private
	 * @param {jQuery} element The element that the tooltip should target.
	 * @param {string} placement The placement for the tooltip.
	 * @return {Object} An object with the top,left position values.
	 */
	function getTransformedHtmlPlacement(element, placement) {
		var objectOffset = element.offset(),
			objectWidth,
			objectHeight,
			objectSize;

		objectSize = getTransformedHtmlDimensions(element);
		objectWidth = objectSize.width;
		objectHeight = objectSize.height;

		return getGenericPlacement(placement, objectOffset, objectWidth, objectHeight);
	}

	/**
	 * Finds the tooltip attachment point in the document for a HTML DOM element
	 * for the specified placement.
	 * @private
	 * @param {jQuery} element The element that the tooltip should target.
	 * @param {string} placement The placement for the tooltip.
	 * @return {Object} An object with the top,left position values.
	 */
	function getHtmlPlacement(element, placement) {
		var objectOffset = element.offset(),
			objectWidth = element.outerWidth(),
			objectHeight = element.outerHeight();

		return getGenericPlacement(placement, objectOffset, objectWidth, objectHeight);
	}


	/**
	 * Returns the appropriate position. Helper for getHtmlPlacement() and
	 * getTransformedHtmlPlacement().
	 * @private
	 * @param {string} placement The placement for the tooltip.
	 * @param {Object} objectOffset Element's offset.
	 * @param {number} Element's width.
	 * @param {number} Element's height.
	 * @return {Object} An object with the top,left position values.
	 */
	function getGenericPlacement(placement, objectOffset, objectWidth, objectHeight) {
		var left,
			top;
		// calculate the appropriate x and y position in the document
		switch (placement) {
		case 'n':
			left = objectOffset.left + objectWidth / 2;
			top = objectOffset.top;
			break;
		case 'e':
			left = objectOffset.left + objectWidth;
			top = objectOffset.top + objectHeight / 2;
			break;
		case 's':
			left = objectOffset.left + objectWidth / 2;
			top = objectOffset.top + objectHeight;
			break;
		case 'w':
			left = objectOffset.left;
			top = objectOffset.top + objectHeight / 2;
			break;
		case 'nw':
			left = objectOffset.left;
			top = objectOffset.top;
			break;
		case 'ne':
			left = objectOffset.left + objectWidth;
			top = objectOffset.top;
			break;
		case 'sw':
			left = objectOffset.left;
			top = objectOffset.top + objectHeight;
			break;
		case 'se':
			left = objectOffset.left + objectWidth;
			top = objectOffset.top + objectHeight;
			break;
		}

		return {
			top: top,
			left: left
		};
	}

	/**
	 * Finds the tooltip attachment point in the document for a SVG element for
	 * the specified placement.
	 * @private
	 * @param {jQuery} element The element that the tooltip should target.
	 * @param {string} placement The placement for the tooltip.
	 * @return {Object} An object with the top,left position values.
	 */
	function getSvgPlacement(element, placement) {
		var svgElement = element.closest('svg')[0],
			domElement = element[0],
			point = svgElement.createSVGPoint(),
			boundingBox = domElement.getBBox(),
			matrix = domElement.getScreenCTM(),
			halfWidth = boundingBox.width / 2,
			halfHeight = boundingBox.height / 2,
			placements = [],
			placementKeys = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'],
			coords,
			rotation,
			steps,
			x;

		function pushPlacement() {
			placements.push(point.matrixTransform(matrix));
		}

		// get bounding box corners and midpoints
		point.x = boundingBox.x;
		point.y = boundingBox.y;
		pushPlacement();
		point.x += halfWidth;
		pushPlacement();
		point.x += halfWidth;
		pushPlacement();
		point.y += halfHeight;
		pushPlacement();
		point.y += halfHeight;
		pushPlacement();
		point.x -= halfWidth;
		pushPlacement();
		point.x -= halfWidth;
		pushPlacement();
		point.y -= halfHeight;
		pushPlacement();

		// determine rotation
		if (placements[0].y !== placements[1].y || placements[0].x !== placements[7].x) {
			rotation = Math.atan2(matrix.b, matrix.a) * RAD2DEG;
			steps = Math.ceil(((rotation % 360) - 22.5) / 45);
			if (steps < 1) {
				steps += 8;
			}
			while (steps--) {
				placementKeys.push(placementKeys.shift());
			}
		}

		// find placement
		for (x = 0; x < placements.length; x++) {
			if (placementKeys[x] === placement) {
				coords = placements[x];
				break;
			}
		}

		return {
			top: coords.y + session.scrollTop,
			left: coords.x + session.scrollLeft
		};
	}

	// expose methods
	this.compute = computePlacementCoords;
}
