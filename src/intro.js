/**
 * PowerTip Intro
 *
 * @fileoverview  Opening lines for dist version.
 * @link          http://stevenbenner.github.io/jquery-powertip/
 * @author        Steven Benner (http://stevenbenner.com/)
 * @requires      jQuery 1.7+
 */

(function(factory) {
	// support loading the plugin as an amd module
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery' ], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
