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
    // -- copy config ----------------------------------------------------------
    copy: {
        adaptGrid: {
            files: [{
                    expand: true,
                    cwd: 'bower_components/adaptGrid/less/',
                    src:  '**',
                    dest: 'less/functions/grid/'
                }
            ]
        },
        normalize: {
          files: [{
            src: 'bower_components/normalize-css/normalize.css', 
            dest: 'less/common/reset/reset.less'
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
        lesshat: {
          files: [{
            expand: true,
            flatten: true,
            cwd: 'bower_components/lesshat/build',
            src: [
                'lesshat.less'
            ],
            dest: 'less/mixins/'
          }]
        }
    },
    
    // -- Clean Config ---------------------------------------------------------

    clean: {
        css    : ['css/'],
        release  : ['release/']
    },

    // -- Less Config ----------------------------------------------------------

    less: {
      dist: {
        files: {
          "css/prelude.css": "less/prelude.less"
        }
      }
    },

    // -- CSSLint Config -------------------------------------------------------

    csslint: {
        options: {
            csslintrc: '.csslintrc'
        },

        src: {
            src: [
                'css/**/*.css'
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
            src   : ['css/*.css','!css/*-min.css'],
            ext   : '-min.css'
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

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-csscomb');

  // Default task.
  grunt.registerTask('default', ['clean', 'css']);
  grunt.registerTask('css', ['less','csscomb','cssmin']);
};
