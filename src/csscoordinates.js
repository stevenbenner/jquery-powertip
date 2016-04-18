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

	/**
	 * Check if a property is set
	 * @private
	 * @param {string} property The name of the property.
	 */
	me.isSet = function(property) {
		return $.isNumeric(me[property]);
	};
}
