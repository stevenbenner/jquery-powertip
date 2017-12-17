/**
 * PowerTip Grunt Config
 */

'use strict';

module.exports = function(grunt) {
	// include grunt enhancements
	require('time-grunt')(grunt);
	require('jit-grunt')(grunt);

	// configure grunt
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		paths: {
			build: 'dist',
			temp: '<%= paths.build %>/temp'
		},
		files: {
			cat: 'jquery.powertip.js',
			min: 'jquery.powertip.min.js',
			zip: 'jquery.powertip-<%= pkg.version %>.zip',
			license: 'LICENSE.txt',
			changelog: 'CHANGELOG.yml'
		},
		clean: {
			dist: [ '<%= paths.build %>' ],
			temp: [ '<%= paths.temp %>' ]
		},
		eslint: {
			options: {
				format: 'codeframe'
			},
			grunt: {
				src: [ 'Gruntfile.js' ]
			},
			tests: {
				src: [ 'test/**/*.js' ]
			},
			js: {
				options: {
					configFile: 'src/.eslintrc.json'
				},
				src: [ '<%= paths.build %>/<%= files.cat %>' ]
			}
		},
		jsonlint: {
			project: {
				src: [
					'package.json',
					'.eslintrc.json',
					'{src,test}/.eslintrc.json'
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
				dest: '<%= paths.temp %>/core.js',
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
				dest: '<%= paths.temp %>/bundle.js'
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
				src: [ '<%= paths.build %>/<%= files.cat %>' ],
				dest: '<%= paths.build %>/<%= files.min %>',
				options: {
					output: {
						comments: /^!/
					},
					report: 'gzip',
					ie8: true
				}
			}
		},
		copy: {
			dist: {
				src: [ 'src/wrapper.js' ],
				dest: '<%= paths.build %>/<%= files.cat %>',
				options: {
					process: function(content) {
						let replaceRegex = /\s\/\* \[POWERTIP CODE\] \*\//,
							coreFile = grunt.file.read(grunt.template.process('<%= concat.core.dest %>'));
						return grunt.template.process(content).replace(replaceRegex, coreFile);
					}
				}
			},
			css: {
				src: [ 'css/*.css' ],
				dest: '<%= paths.build %>/'
			},
			examples: {
				src: [ 'examples/*' ],
				dest: '<%= paths.build %>/',
				options: {
					process: function(content) {
						let scriptsRegex = /<!-- begin-scripts -->(?:.*\r?\n\s)*<!-- end-scripts -->/,
							builtScriptTag = '<script type="text/javascript" src="../<%= files.cat %>"></script>';
						return content.replace(scriptsRegex, grunt.template.process(builtScriptTag));
					}
				}
			},
			browserify: {
				src: [ 'test/browserify.html' ],
				dest: '<%= paths.temp %>/browserify.html',
				nonull: true
			},
			license: {
				src: [ '<%= files.license %>' ],
				dest: '<%= paths.build %>/<%= files.license %>',
				nonull: true
			},
			changelog: {
				src: [ '<%= files.changelog %>' ],
				dest: '<%= paths.build %>/<%= files.changelog %>',
				nonull: true
			},
			index: {
				src: [ '<%= paths.build %>/index.md' ],
				dest: 'index.md',
				nonull: true
			},
			jsassets: {
				src: [ '<%= paths.build %>/<%= files.cat %>' ],
				dest: 'scripts/<%= files.cat %>',
				nonull: true
			},
			cssassets: {
				files: [
					{
						expand: true,
						cwd: '<%= paths.build %>/css/',
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
					ids: false,
					'order-alphabetical': false
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
						dest: '<%= paths.build %>/css/',
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
					archive: '<%= paths.build %>/<%= files.zip %>'
				},
				files: [
					{
						expand: true,
						cwd: '<%= paths.build %>/',
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
		let template = grunt.file.read('doc/gh-pages.template.md'),
			data = {
				pkg: grunt.file.readJSON('package.json'),
				doc: grunt.file.read('doc/README.md'),
				changelog: grunt.file.readYAML(grunt.template.process('<%= files.changelog %>'))
			},
			page = grunt.template.process(template, { data: data });
		grunt.file.write('dist/index.md', page);
		grunt.log.ok('gh-pages markdown created');
	});

	// force unix style line endings
	grunt.util.linefeed = '\n';

	// register grunt tasks
	grunt.registerTask('default', [ 'test' ]);
	grunt.registerTask('test', [ 'jsonlint', 'concat:core', 'indent', 'copy:dist', 'eslint', 'qunit:tests', 'test:browserify', 'csslint', 'clean:temp' ]);
	grunt.registerTask('test:browserify', [ 'copy:browserify', 'browserify', 'qunit:browserify' ]);
	grunt.registerTask('build', [ 'jsonlint', 'build:js', 'build:css' ]);
	grunt.registerTask('build:js', [ 'concat:core', 'indent', 'copy:dist', 'eslint', 'qunit:tests', 'test:browserify', 'uglify', 'clean:temp' ]);
	grunt.registerTask('build:css', [ 'csslint', 'copy:css', 'cssmin' ]);
	grunt.registerTask('build:docs', [ 'copy:examples', 'copy:license', 'copy:changelog' ]);
	grunt.registerTask('build:release', [ 'clean:dist', 'build', 'build:docs', 'compress' ]);
	grunt.registerTask('build:npm', [ 'clean:dist', 'build' ]);
	grunt.registerTask('travis', [ 'test' ]);
	grunt.registerTask('deploy:docs', [ 'build:gh-pages', 'shell:checkoutpages', 'copy:index', 'shell:addindex', 'shell:checkoutmaster' ]);
	grunt.registerTask('deploy:assets', [ 'build:release', 'shell:checkoutpages', 'copy:jsassets', 'copy:cssassets', 'shell:addassets', 'shell:checkoutmaster' ]);
};
