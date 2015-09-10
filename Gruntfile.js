module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            html: ["dest/*.html"],
            images: ["dest/images"],
            css: ["dest/css/*.css"],
            js: ["dest/js/*.js"],
            module: ["dest/js/module/*.js"],
            plugin: ["dest/js/plugin/*.js"]
        },
        imagemin: {                          // Task
            target: {                         // Another target
                options: {
                    optimizationLevel: 0   // png图片优化水平，3是默认值，取值区间0-7
                },
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'src/images/',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'dest/images/'
                }]
            }
        },
        htmlmin: {                                     // Task
            target: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'src/',
                    src: ['*.html'],
                    dest: 'dest/'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css'],
                    dest: 'dest/css/'
                }]
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: ['require', 'exports', 'module']
                }
            },
            js: {
                expand: true,
                cwd: 'src/js',
                src: ['*.js'],
                dest: 'dest/js/'
            },
            module: {
                expand: true,
                cwd: 'src/js/module',
                src: ['*.js'],
                dest: 'dest/js/module/'
            },
            plugin: {
                expand: true,
                cwd: 'src/js/plugin',
                src: ['*.js'],
                dest: 'dest/js/plugin/'
            }
        },
        watch: {
            html: {
                files: 'src/*.html',
                tasks: ['clean:html', 'htmlmin']
            },
            images: {
                files: 'src/images/*',
                tasks: ['clean:images', 'imagemin']
            },
            css: {
                files: 'src/css/*.css',
                tasks: ['clean:css', 'cssmin']
            },
            js: {
                files: 'src/js/*.js',
                tasks: ['clean:js', 'uglify:js']
            },
            module: {
                files: 'src/js/module/*.js',
                tasks: ['clean:module', 'uglify:module']
            },
            plugin: {
                files: 'src/js/plugin/*.js',
                tasks: ['clean:plugin', 'uglify:plugin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['clean', 'imagemin', 'htmlmin', 'uglify', 'cssmin', 'watch']);

};