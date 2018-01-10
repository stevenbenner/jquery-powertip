/**
 * PowerTip CSSCoordinates
 *
 * @fileoverview  CSSCoordinates object for describing CSS positions.
 * @link          https://stevenbenner.github.io/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @requires      jQuery 1.7+
 */

/**
 * Creates a new CSSCoordinates object.
 * @private
 * @constructor
 */
function CSSCoordinates() {
	var me = this;

	/**
	 * Return value the compensated value allowing for the special value of 'auto'.
	 * @private
	 * @param {number} value The value to be compensated.
	 * @param {number} comp The amount by which the value should be adjusted.
	 * @returns {number} The value less comp unless 'auto'
	 */
	function compensated(value, comp) {
		return value === 'auto' ? value : value - comp;
	}

	/**
	 * Return positioned element's origin with respect to the viewport home
	 * @private
	 * @param {object} el The positioned element to measure
	 * @returns {object} The top and left coordinates of the element relative to the viewport.
	 */
	function positionedParentViewportHomeOffset(el) {
		var originX = el[0].getBoundingClientRect().left,
			originY = el[0].getBoundingClientRect().top,
			borderTopWidth = parseFloat(el.css('borderTopWidth')),
			borderLeftWidth = parseFloat(el.css('borderLeftWidth'));
		return {
			top: originY + borderTopWidth + $document.scrollTop(),
			left: originX + borderLeftWidth + $document.scrollLeft()
		};
	}

	// initialize object properties
	me.top = 'auto';
	me.left = 'auto';
	me.right = 'auto';
	me.bottom = 'auto';

	/**
	 * Set a property to a value.
	 * @private
	 * @param {string} property The name of the property.
	 * @param {number} value The value of the property.
	 */
	me.set = function(property, value) {
		if ($.isNumeric(value)) {
			me[property] = Math.round(value);
		}
	};

	me.getCompensated = function() {
		return {
			top: me.topCompensated,
			left: me.leftCompensated,
			right: me.rightCompensated,
			bottom: me.bottomCompensated
		};
	};

	me.fromViewportHome = function() {
		// Coordinates with respect to viewport origin when scrolled to (0,0).
		var coords = me.getCompensated(),
			originOffset;

		// For the cases where there is a positioned ancestor, compensate for offset of
		// ancestor origin. Note that bounding rect includes border, if any.
		if (isPositionNotStatic($body)) {
			originOffset = positionedParentViewportHomeOffset($body);
			if (coords.top !== 'auto') {
				coords.top = coords.top + originOffset.top;
			}
			if (coords.left !== 'auto') {
				coords.left = coords.left + originOffset.left;
			}
			if (coords.right !== 'auto') {
				coords.right = originOffset.left + $body.width() - coords.right;
			}
			if (coords.bottom !== 'auto') {
				coords.bottom = originOffset.top + $body.height() - coords.bottom;
			}
		} else if (isPositionNotStatic($html)) {
			originOffset = positionedParentViewportHomeOffset($html);
			if (coords.top !== 'auto') {
				coords.top = coords.top + originOffset.top;
			}
			if (coords.left !== 'auto') {
				coords.left = coords.left + originOffset.left;
			}
			if (coords.right !== 'auto') {
				coords.right = originOffset.left + $body.width() - coords.right;
			}
			if (coords.bottom !== 'auto') {
				coords.bottom = originOffset.top + $body.height() - coords.bottom;
			}
		} else {
			// Change origin of right, bottom measurement to viewport (0,0) and invert sign
			if (coords.right !== 'auto') {
				coords.right = session.windowWidth - coords.right;
			}
			if (coords.bottom !== 'auto') {
				coords.bottom = session.windowHeight - coords.bottom;
			}
		}

		return coords;
	};

	Object.defineProperty(me, 'topCompensated', {
		get: function() {
			return compensated(me.top, session.positionCompensation.top);
		}
	});

	Object.defineProperty(me, 'bottomCompensated', {
		get: function() {
			return compensated(me.bottom, session.positionCompensation.bottom);
		}
	});

	Object.defineProperty(me, 'leftCompensated', {
		get: function() {
			return compensated(me.left, session.positionCompensation.left);
		}
	});

	Object.defineProperty(me, 'rightCompensated', {
		get: function() {
			return compensated(me.right, session.positionCompensation.right);
		}
	});
}
