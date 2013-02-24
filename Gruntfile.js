/**
 * PowerTip Grunt Config
 */

module.exports = function(grunt) {
	'use strict';

	// configure grunt
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		buildpath: 'dist/<%= pkg.version %>',
		files: {
			cat: 'jquery.powertip-<%= pkg.version %>.js',
			min: 'jquery.powertip-<%= pkg.version %>.min.js'
		},
		banner: [
			'/*!',
			' <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
			' <%= pkg.homepage %>',
			' Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> (<%= pkg.author.url %>).',
			' Released under <%= _.pluck(pkg.licenses, "type").join(", ") %> license.',
			' <%= _.pluck(pkg.licenses, "url").join("\\n ") %>',
			'*/\n'
		].join('\n'),
		jshint: {
			grunt: {
				src: [ 'Gruntfile.js' ],
				options: {
					jshintrc: '.jshintrc'
				}
			},
			tests: {
				src: [ 'test/**/*.js' ],
				options: {
					jshintrc: 'test/.jshintrc'
				}
			},
			dist: {
				src: [ '<%= buildpath %>/<%= files.cat %>' ],
				options: {
					jshintrc: 'src/.jshintrc'
				}
			}
		},
		concat: {
			dist: {
				src: [
					'src/intro.js',
					'src/core.js',
					'src/csscoordinates.js',
					'src/displaycontroller.js',
					'src/placementcalculator.js',
					'src/tooltipcontroller.js',
					'src/utility.js',
					'src/outro.js'
				],
				dest: '<%= buildpath %>/<%= files.cat %>',
				options: {
					banner: '<%= banner %>',
					stripBanners: true
				}
			}
		},
		qunit: {
			files: [ 'test/index.html' ]
		},
		uglify: {
			dist: {
				files: {
					'<%= buildpath %>/<%= files.min %>': '<%= buildpath %>/<%= files.cat %>'
				},
				options: {
					banner: '<%= banner %>'
				}
			}
		},
		watch: {
			grunt: {
				files: [ 'Gruntfile.js' ],
				tasks: [ 'jshint:grunt' ]
			},
			src: {
				files: [ 'src/**/*.js' ],
				tasks: [ 'concat', 'jshint:dist', 'qunit' ]
			},
			tests: {
				files: [ 'test/**/*.js' ],
				tasks: [ 'jshint:tests', 'qunit' ]
			}
		}
	});

	// load grunt plugins
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// register grunt tasks
	grunt.registerTask('default', [ 'jshint:grunt', 'jshint:tests', 'concat', 'jshint:dist', 'qunit', 'uglify' ]);
	grunt.registerTask('travis', [ 'jshint:grunt', 'jshint:tests', 'concat', 'jshint:dist', 'qunit' ]);

};
