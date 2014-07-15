'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.

		/*
		 * Config
		 */
		config : {
			less : {
				// <%=config.less.distDir%>
				distDir	: 'dist/',
				// <%=config.less.srcDir%>
				srcDir  : 'less/'
			}
		},

		// -- concat config ----------------------------------------------------------
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
            	expand: true,
            	cwd: 'dist/',
                src: ['*.css'],
                dest: 'dist/'
            }
        },

		// -- copy config ----------------------------------------------------------
		copy: {
			fontAwesome: {
				files: [{
						expand: true,
						cwd: 'bower_components/Font-Awesome/fonts/',
						src:	'**',
						dest: 'fonts/fontawesome/'
					},
					{
						flatten: true,
						src: 'bower_components/Font-Awesome/less/icons.less', 
						dest: 'fonts/fontawesome/icons.less'
					},
					{
						flatten: true,
						src: 'bower_components/Font-Awesome/less/variables.less', 
						dest: 'fonts/fontawesome/variables.less'
					}
				]
			},
			adaptGrid: {
					files: [{
							expand: true,
							cwd: 'bower_components/adaptGrid/dist/',
							src:	'**',
							dest: 'less/functions/grid/'
						}
					]
			},
			normalize: {
				files: [{
					src: 'bower_components/normalize-css/normalize.css', 
					dest: 'less/common/normalize.less'
				}]
			},
			rainbow: {
				files: [{
					expand: true,
					flatten: true,
					cwd: 'bower_components/rainbow/js',
					src: [
							'rainbow.min.js',
					],
					dest: 'test/js/highlighting/'
				},
				{
					expand: true,
					flatten: true,
					cwd: 'bower_components/rainbow/js/language',
					src: [
							'html.js'
					],
					dest: 'test/js/highlighting/'
				},
				{
					expand: true,
					flatten: true,
					cwd: 'bower_components/rainbow/themes',
					src: [
							'github.css'
					],
					dest: 'test/css/highlighting/'
				}]
			},
			mixins: {
				files: [{
					expand: true,
					flatten: true,
					cwd: 'bower_components/prelude-mixins/dist',
					src: [
							'*.less', '!variables.less'
					],
					dest: 'less/mixins/'
				}]
			}
		},
		
		// -- Clean Config ---------------------------------------------------------

		clean: {
			css		: ['dist/'],
			release	: ['release/']
		},

		// -- Less Config ----------------------------------------------------------

		less: {
			dist: {
				files: {
					"dist/prelude.css": "less/prelude.less"
				}
			}
		},

		// -- LessLint Config -------------------------------------------------------

		lesslint: {
			src: ['less/*.less']
		},

		// -- CSSLint Config -------------------------------------------------------

		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},

			src: {
				src: [
					'dist/**/*.css'
				]
			}
		},

		// -- CSSMin Config --------------------------------------------------------

		cssmin: {
			options: {
					// report: 'gzip'
			},

			files: {
				expand: true,
				src	 : ['dist/*.css','!dist/*-min.css'],
				ext	 : '-min.css'
			}
		},

		// -- CSSMin Config --------------------------------------------------------
		csscomb: {
			sort: {
				options: {
					sortOrder: '.csscomb.json'
				},
				files: {
					'css/prelude.css': ['css/prelude.css'],
				}
			}
		},

		// -- Watch/Observe Config -------------------------------------------------
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			}
		},

		// -- replace config ----------------------------------------------------------
        replace: {
            bower: {
                src: ['bower.json'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: /("version": ")([0-9\.]+)(")/g,
                    to: "$1<%= pkg.version %>$3"
                }]
            },
            jquery: {
                src: ['asTabs.jquery.json'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: /("version": ")([0-9\.]+)(")/g,
                    to: "$1<%= pkg.version %>$3"
                }]
            },
            normalize: {
            	src: ['less/common/normalize.less'],
                overwrite: true, // overwrite matched source files
            	replacements: [{
                    from: /\/\*! normalize\.css .* \*\//g,
                    to: ''
                }]
            }
        },

		// -- jQuery builder Config -------------------------------------------------
		jquery: {
			build: {
				options: {
					prefix: "jquery-",
					minify: true
				},
				output: "test/js/libs/jquery",
				versions: {
					"2.1.1": [ "deprecated"]
				}
			}
		}
	});

	// Load npm plugins to provide necessary tasks.
	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*']
	});

	// Default task.
	grunt.registerTask('default', ['clean', 'css', 'concat']);
	grunt.registerTask('css', ['less','csscomb','cssmin']);
	grunt.registerTask('update', ['copy','replace:normalize']);
	grunt.registerTask('version', [
        'replace:bower',
        'replace:jquery'
    ]);
};
