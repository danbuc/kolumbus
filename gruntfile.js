module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['extensions/js/<%= pkg.name %>/app.js','extensions/js/<%= pkg.name %>/*.js'],
        dest: 'extensions/js/dist/app.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'extensions/js/dist/app.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    less: {
      dev: {
        files: {
          "extensions/css/app.css": "extensions/css/app.less"
        }
      },
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          "extensions/css/app.css": "extensions/css/app.less"
        }
      }
    },
    imageEmbed: {
      dist: {
        src: [ "extensions/css/app.css" ],
        dest: "extensions/css/app-base64.css",
        options: {
          deleteAfterEncoding : false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks("grunt-image-embed");

  grunt.registerTask('default', ['concat', 'uglify','less:dev']);
  grunt.registerTask('build', ['concat', 'uglify', 'less:dist']);
  grunt.registerTask('embed', ['imageEmbed']); //not in build yet due to issue that fonts are embedded, too

};
