module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            html: ["./*.html"],
            cache: ["./*.appcache"],
            images: ["./images"],
            css: ["./css/*.css"],
            js: ["./js/*.js"],
            module: ["./js/module/*.js"],
            plugin: ["./js/plugin/*.js"]
        },
        copy: {
            main: {
                expand: true,
                cwd: 'debug/',
                src: ['*.appcache'],
                dest: './'
            }
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
        less: {
            dist: {
                options: {                       // Target options
                    strictMath: true,
                    strictUnits: false
                },
                files: [{
                    expand: true,
                    cwd: 'debug/less',
                    src: ['*.less'],
                    dest: 'debug/css',
                    ext: '.css'
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
            cache: {
                files: 'debug/*.appcache',
                tasks: ['newer:clean:cache', 'newer:copy']
            },
            images: {
                files: 'debug/images/*',
                tasks: ['newer:clean:images', 'newer:imagemin']
            },
            less: {
                files: 'debug/less/*.less',
                tasks: ['newer:less']
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

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['clean', 'copy', 'htmlmin', 'uglify', 'less', 'cssmin', 'imagemin', 'watch']);

};