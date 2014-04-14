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
		jscs: {
			grunt: {
				src: [ 'Gruntfile.js' ],
				options: {
					config: '.jscsrc'
				}
			},
			tests: {
				src: [ 'test/**/*.js' ],
				options: {
					config: '.jscsrc'
				}
			},
			js: {
				src: [ 'src/*.js' ],
				options: {
					config: '.jscsrc'
				}
			},
			dist: {
				src: [ '<%= buildpath %>/<%= files.cat %>' ],
				options: {
					config: '.jscsrc'
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
				src: [ '<%= buildpath %>/<%= files.cat %>' ],
				dest: '<%= buildpath %>/<%= files.min %>',
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
				dest: '<%= buildpath %>/',
				options: {
					processContent: function(content) {
						var scriptsRegex = /<!-- begin-scripts -->(?:.*\r?\n\s)*<!-- end-scripts -->/,
							builtScriptTag = '<script type="text/javascript" src="../<%= files.cat %>"></script>';
						return content.replace(scriptsRegex, grunt.template.process(builtScriptTag));
					}
				}
			},
			license: {
				src: [ 'LICENSE.txt' ],
				dest: '<%= buildpath %>/LICENSE.txt'
			},
			changelog: {
				src: [ 'CHANGELOG.yml' ],
				dest: '<%= buildpath %>/CHANGELOG.yml'
			},
			index: {
				src: [ '<%= buildpath %>/index.md' ],
				dest: 'index.md'
			},
			zipassets: {
				src: [ '<%= buildpath %>/<%= files.zip %>' ],
				dest: 'releases/<%= files.zip %>'
			},
			jsassets: {
				src: [ '<%= buildpath %>/<%= files.cat %>' ],
				dest: 'scripts/<%= files.cat %>'
			},
			cssassets: {
				files: [
					{
						expand: true,
						cwd: '<%= buildpath %>/css/',
						src: [ '*.css', '!*.min.css' ],
						dest: 'styles/'
					}
				]
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
				],
				options: {
					report: 'gzip'
				}
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
		shell: {
			checkoutpages: {
				command: 'git checkout gh-pages'
			},
			addindex: {
				command: [
					'git add index.md',
					'git commit -m "Publishing docs."'
				].join(' && ')
			},
			addassets: {
				command: [
					'git add releases/<%= files.zip %>',
					'git add scripts/<%= files.cat %>',
					'git add styles/jquery.powertip*.css',
					'git commit -m "Publishing assets."'
				].join(' && ')
			},
			checkoutmaster: {
				command: 'git checkout master'
			}
		},
		watch: {
			grunt: {
				files: [ 'Gruntfile.js', '.jshintrc' ],
				tasks: [ 'jshint:grunt',  'jscs:grunt' ]
			},
			src: {
				files: [ 'src/**/*.js' ],
				tasks: [ 'concat:core', 'indent', 'concat:dist', 'clean:temp', 'jshint:dist', 'jscs:js', 'jscs:dist', 'qunit' ]
			},
			srcjshint: {
				files: [ 'src/.jshintrc' ],
				tasks: [ 'concat:core', 'indent', 'concat:dist', 'clean:temp', 'jshint:dist' ]
			},
			tests: {
				files: [ 'test/**/*.js' ],
				tasks: [ 'jshint:tests', 'jscs:tests', 'concat:core', 'indent', 'concat:dist', 'clean:temp', 'qunit' ]
			},
			testsjshint: {
				files: [ 'test/.jshintrc' ],
				tasks: [ 'jshint:tests' ]
			},
			css: {
				files: [ 'css/*.css' ],
				tasks: [ 'csslint' ]
			}
		}
	});

	// custom task to build the gh-pages index.md file
	grunt.registerTask('build:gh-pages', 'Create the gh-pages markdown.', function() {
		var template = grunt.file.read('doc/gh-pages.template.md'),
			data = {
				pkg: grunt.file.readJSON('package.json'),
				doc: grunt.file.read('doc/README.md'),
				changelog: grunt.file.readYAML('CHANGELOG.yml')
			},
			page = grunt.template.process(template, { data: data });
		grunt.file.write('dist/index.md', page);
		grunt.log.ok('gh-pages markdown created');
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
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-indent');
	grunt.loadNpmTasks('grunt-jscs-checker');

	// register grunt tasks
	grunt.registerTask('default', [ 'test' ]);
	grunt.registerTask('test', [ 'concat:core', 'indent', 'concat:dist', 'clean:temp', 'jshint', 'jscs', 'qunit', 'csslint' ]);
	grunt.registerTask('build', [ 'build:js', 'build:css', 'build:docs' ]);
	grunt.registerTask('build:js', [ 'concat:core', 'indent', 'concat:dist', 'clean:temp', 'jshint', 'jscs', 'qunit', 'uglify' ]);
	grunt.registerTask('build:css', [ 'csslint', 'copy:css', 'cssmin' ]);
	grunt.registerTask('build:docs', [ 'copy:examples', 'copy:license', 'copy:changelog' ]);
	grunt.registerTask('build:release', [ 'clean:dist', 'build', 'compress' ]);
	grunt.registerTask('travis', [ 'test' ]);
	grunt.registerTask('deploy:docs', [ 'build:gh-pages', 'shell:checkoutpages', 'copy:index', 'shell:addindex', 'shell:checkoutmaster' ]);
	grunt.registerTask('deploy:assets', [ 'build:release', 'shell:checkoutpages', 'copy:zipassets', 'copy:jsassets', 'copy:cssassets', 'shell:addassets', 'shell:checkoutmaster' ]);

};
