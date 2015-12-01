module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            html: ["./*.html"],
            images: ["./images"],
            css: ["./css/*.css"],
            js: ["./js/*.js"],
            module: ["./js/module/*.js"],
            plugin: ["./js/plugin/*.js"]
        },
        imagemin: {                          // Task
            target: {                         // Another target
                options: {
                    optimizationLevel: 0   // png图片优化水平，3是默认值，取值区间0-7
                },
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'debug/images/',
                    src: ['*.{png,jpg,gif}'],
                    dest: './images/'
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
                    cwd: 'debug/',
                    src: ['*.html'],
                    dest: './'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'debug/css',
                    src: ['*.css'],
                    dest: './css/'
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
                cwd: 'debug/js',
                src: ['*.js'],
                dest: './js/'
            },
            module: {
                expand: true,
                cwd: 'debug/js/module',
                src: ['*.js'],
                dest: './js/module/'
            },
            plugin: {
                expand: true,
                cwd: 'debug/js/plugin',
                src: ['*.js'],
                dest: './js/plugin/'
            }
        },
        watch: {
            html: {
                files: 'debug/*.html',
                tasks: ['newer:clean:html', 'newer:htmlmin']
            },
            images: {
                files: 'debug/images/*',
                tasks: ['newer:clean:images', 'newer:imagemin']
            },
            css: {
                files: 'debug/css/*.css',
                tasks: ['newer:clean:css', 'newer:cssmin']
            },
            js: {
                files: 'debug/js/*.js',
                tasks: ['newer:clean:js', 'newer:uglify:js']
            },
            module: {
                files: 'debug/js/module/*.js',
                tasks: ['newer:clean:module', 'newer:uglify:module']
            },
            plugin: {
                files: 'debug/js/plugin/*.js',
                tasks: ['newer:clean:plugin', 'newer:uglify:plugin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['clean', 'imagemin', 'htmlmin', 'uglify', 'cssmin', 'watch']);

};