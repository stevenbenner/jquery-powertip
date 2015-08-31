/**
 * PowerTip Intro
 *
 * @fileoverview  Opening lines for dist version.
 * @link          https://stevenbenner.github.io/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @requires      jQuery 1.7+
 */

(function(root, factory) {
	// support loading the plugin via common patterns
	if (typeof define === 'function' && define.amd) {
		// load the plugin as an amd module
		define([ 'jquery' ], factory);
	} else if (typeof module === 'object' && module.exports) {
		// load the plugin as a commonjs module
		module.exports = factory(require('jquery'));
	} else {
		// load the plugin as a global
		factory(root.jQuery);
	}
}(this, function($) {
