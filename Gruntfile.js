/**
 * PowerTip Grunt Config
 */

module.exports = function(grunt) {
	'use strict';

	// include grunt enhancements
	require('time-grunt')(grunt);
	require('jit-grunt')(grunt);

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
			' <%= pkg.title %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)',
			' <%= pkg.homepage %>',
			' Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> (<%= pkg.author.url %>).',
			' Released under <%= pkg.license %> license.',
			' https://raw.github.com/stevenbenner/jquery-powertip/master/LICENSE.txt',
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
			options: {
				config: '.jscsrc'
			},
			grunt: {
				src: [ 'Gruntfile.js' ]
			},
			tests: {
				src: [ 'test/**/*.js' ]
			},
			js: {
				src: [ 'src/*.js' ]
			}
		},
		jsonlint: {
			project: {
				src: [
					'package.json',
					'.jscsrc',
					'.jshintrc',
					'{src,test}/.jshintrc'
				]
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
				dest: '<%= temppath %>/core.js',
				nonull: true
			},
			dist: {
				src: [
					'src/intro.js',
					'<%= concat.core.dest %>',
					'src/outro.js'
				],
				dest: '<%= buildpath %>/<%= files.cat %>',
				options: {
					banner: '<%= banner %>'
				},
				nonull: true
			}
		},
		indent: {
			js: {
				src: [ '<%= concat.core.dest %>' ],
				dest: '<%= concat.core.dest %>',
				options: {
					change: 1
				}
			}
		},
		browserify: {
			test: {
				src: [ 'test/browserify.js' ],
				dest: '<%= temppath %>/bundle.js'
			}
		},
		qunit: {
			tests: [
				'test/index.html',
				'test/amd.html'
			],
			browserify: [ '<%= copy.browserify.dest %>' ]
		},
		uglify: {
			dist: {
				src: [ '<%= buildpath %>/<%= files.cat %>' ],
				dest: '<%= buildpath %>/<%= files.min %>',
				options: {
					banner: '<%= banner %>',
					report: 'gzip',
					screwIE8: false
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
					process: function(content) {
						var scriptsRegex = /<!-- begin-scripts -->(?:.*\r?\n\s)*<!-- end-scripts -->/,
							builtScriptTag = '<script type="text/javascript" src="../<%= files.cat %>"></script>';
						return content.replace(scriptsRegex, grunt.template.process(builtScriptTag));
					}
				}
			},
			browserify: {
				src: [ 'test/browserify.html' ],
				dest: '<%= temppath %>/browserify.html',
				nonull: true
			},
			license: {
				src: [ 'LICENSE.txt' ],
				dest: '<%= buildpath %>/LICENSE.txt',
				nonull: true
			},
			changelog: {
				src: [ 'CHANGELOG.yml' ],
				dest: '<%= buildpath %>/CHANGELOG.yml',
				nonull: true
			},
			index: {
				src: [ '<%= buildpath %>/index.md' ],
				dest: 'index.md',
				nonull: true
			},
			jsassets: {
				src: [ '<%= buildpath %>/<%= files.cat %>' ],
				dest: 'scripts/<%= files.cat %>',
				nonull: true
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
					'git commit -m "Publishing docs"'
				].join(' && ')
			},
			addassets: {
				command: [
					'git add scripts/<%= files.cat %>',
					'git add styles/jquery.powertip*.css',
					'git commit -m "Publishing assets"'
				].join(' && ')
			},
			checkoutmaster: {
				command: 'git checkout master'
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

	// register grunt tasks
	grunt.registerTask('default', [ 'test' ]);
	grunt.registerTask('test', [ 'jsonlint', 'concat:core', 'indent', 'concat:dist', 'jshint', 'jscs', 'qunit:tests', 'test:browserify', 'csslint', 'clean:temp' ]);
	grunt.registerTask('test:browserify', [ 'copy:browserify', 'browserify', 'qunit:browserify' ]);
	grunt.registerTask('build', [ 'jsonlint', 'build:js', 'build:css' ]);
	grunt.registerTask('build:js', [ 'concat:core', 'indent', 'concat:dist', 'jshint', 'jscs', 'qunit:tests', 'test:browserify', 'uglify', 'clean:temp' ]);
	grunt.registerTask('build:css', [ 'csslint', 'copy:css', 'cssmin' ]);
	grunt.registerTask('build:docs', [ 'copy:examples', 'copy:license', 'copy:changelog' ]);
	grunt.registerTask('build:release', [ 'clean:dist', 'build', 'build:docs', 'compress' ]);
	grunt.registerTask('build:npm', [ 'clean:dist', 'build' ]);
	grunt.registerTask('travis', [ 'test' ]);
	grunt.registerTask('deploy:docs', [ 'build:gh-pages', 'shell:checkoutpages', 'copy:index', 'shell:addindex', 'shell:checkoutmaster' ]);
	grunt.registerTask('deploy:assets', [ 'build:release', 'shell:checkoutpages', 'copy:jsassets', 'copy:cssassets', 'shell:addassets', 'shell:checkoutmaster' ]);
};
