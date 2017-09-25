/*!
 <%= pkg.title %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)
 <%= pkg.homepage %>
 Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> (<%= pkg.author.url %>).
 Released under <%= pkg.license %> license.
 https://raw.github.com/stevenbenner/jquery-powertip/master/<%= files.license %>
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
	/* [POWERTIP CODE] */
	// return api for commonjs and amd environments
	return $.powerTip;
}));
