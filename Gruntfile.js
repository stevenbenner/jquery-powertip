/**
 * PowerTip Grunt Config
 */

module.exports = function(grunt) {
	'use strict';

	// configure grunt
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		buildpath: 'dist',
		temppath: '<%= buildpath %>/temp',
		files: {
			cat: 'jquery.powertip.js',
			min: 'jquery.powertip.min.js',
			zip: 'jquery.powertip-<%= pkg.version %>.zip'
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
		clean: {
			dist: [ '<%= buildpath %>' ],
			temp: [ '<%= temppath %>' ]
		},
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
			options: {
				stripBanners: true
			},
			core: {
				src: [
					'src/core.js',
					'src/csscoordinates.js',
					'src/displaycontroller.js',
					'src/placementcalculator.js',
					'src/tooltipcontroller.js',
					'src/utility.js'
				],
				dest: '<%= temppath %>/core.js'
			},
			dist: {
				src: [
					'src/intro.js',
					'<%= temppath %>/core.js',
					'src/outro.js'
				],
				dest: '<%= buildpath %>/<%= files.cat %>',
				options: {
					banner: '<%= banner %>'
				}
			}
		},
		indent: {
			js: {
				src: [ '<%= temppath %>/core.js' ],
				dest: '<%= temppath %>/core.js',
				options: {
					change: 1
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
					banner: '<%= banner %>',
					report: 'gzip'
				}
			}
		},
		copy: {
			css: {
				src: [ 'css/*.css' ],
				dest: '<%= buildpath %>/'
			},
			examples: {
				src: [ 'examples/*' ],
				dest: '<%= buildpath %>/'
			},
			license: {
				src: [ 'LICENSE.txt' ],
				dest: '<%= buildpath %>/LICENSE.txt'
			}
		},
		csslint: {
			themes: {
				src: [ 'css/*.css' ],
				options: {
					ids: false
				}
			}
		},
		cssmin: {
			compress: {
				files: [
					{
						expand: true,
						cwd: 'css/',
						src: [ '*.css' ],
						dest: '<%= buildpath %>/css/',
						rename: function(dest, matchedSrcPath) {
							return dest + matchedSrcPath.replace('.css', '.min.css');
						}
					}
				]
			}
		},
		compress: {
			zip: {
				options: {
					archive: '<%= buildpath %>/<%= files.zip %>'
				},
				files: [
					{
						expand: true,
						cwd: '<%= buildpath %>/',
						src: [ '**/*' ]
					}
				]
			}
		},
		watch: {
			grunt: {
				files: [ 'Gruntfile.js', '.jshintrc' ],
				tasks: [ 'jshint:grunt' ]
			},
			src: {
				files: [ 'src/**/*.js', 'src/.jshintrc' ],
				tasks: [ 'concat', 'jshint:dist', 'qunit' ]
			},
			tests: {
				files: [ 'test/**/*.js', 'test/.jshintrc' ],
				tasks: [ 'jshint:tests', 'qunit' ]
			},
			css: {
				files: [ 'css/*.css' ],
				tasks: [ 'csslint' ]
			}
		}
	});

	// force unix style line endings
	grunt.util.linefeed = '\n';

	// load grunt plugins
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-indent');

	// register grunt tasks
	grunt.registerTask('default', [ 'build:js' ]);
	grunt.registerTask('build', [ 'build:js', 'build:css', 'build:docs' ]);
	grunt.registerTask('build:js', [ 'concat:core', 'indent', 'concat:dist', 'clean:temp', 'jshint', 'qunit', 'uglify' ]);
	grunt.registerTask('build:css', [ 'csslint', 'copy:css', 'cssmin' ]);
	grunt.registerTask('build:docs', [ 'copy:examples', 'copy:license' ]);
	grunt.registerTask('build:release', [ 'clean:dist', 'build', 'compress' ]);
	grunt.registerTask('travis', [ 'concat:core', 'indent', 'concat:dist', 'clean:temp', 'jshint', 'qunit', 'csslint' ]);

};
