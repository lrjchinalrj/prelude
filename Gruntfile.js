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
							dest: '<%=config.less.srcDir%>/functions/grid/'
						}
					]
			},
			normalize: {
				files: [{
					src: 'bower_components/normalize-css/normalize.css', 
					dest: '<%=config.less.srcDir%>/common/normalize.less'
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
					dest: '<%=config.less.srcDir%>/mixins/'
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
					"dist/prelude.css": "<%=config.less.srcDir%>/prelude.less"
				}
			}
		},

		// -- LessLint Config -------------------------------------------------------

		lesslint: {
			src: ['<%=config.less.srcDir%>/*.less']
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

			dist: {
				expand: true,
				src	 : ['dist/*.css','!dist/*-min.css'],
				ext	 : '-min.css'
			},

			normalize: {
				options: {
					keepSpecialComments: 0
				},
				files: {
					'<%=config.less.srcDir%>/common/normalize.less': ['<%=config.less.srcDir%>/common/normalize.less']
				}
			}
		},

		// -- CSSMin Config --------------------------------------------------------
		csscomb: {
			sort: {
				options: {
					sortOrder: '.csscomb.json'
				},
				files: {
					'dist/prelude.css': ['dist/prelude.css'],
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

		// -- csspretty Config --------------------------------------------------------
		csspretty: {
			options: {
				decl: {
					before: '\n\t',
					between: ': ',
				},
				rule: {
					before: '\n',
					between: ' ',
					after: '\n',
				},
				atRule: {
					before: '\n',
					between: ' ',
					indent: '\t',
					after: '\n',
				},
				selectors: 'same',
			},
			dist: {
				src: '<%=config.less.distDir%>/prelude.css',
			},
			normalize: {
				options: {
					rule: {
						before: '\n\n',
						between: ' ',
						after: '\n',
					},
					atRule: {
						before: '\n\n',
						between: ' ',
						indent: '\t',
						after: '\n',
					},
					selectors: 'separateline',
				},
				src: '<%=config.less.srcDir%>/common/normalize.less',
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
	grunt.registerTask('css', ['less','csscomb','cssmin:dist','csspretty:dist']);
	grunt.registerTask('normalize', ['copy:normalize','cssmin:normalize','csspretty:normalize']);
	grunt.registerTask('version', [
        'replace:bower',
        'replace:jquery'
    ]);
};
