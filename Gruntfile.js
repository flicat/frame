module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json');
    var version = Date.now();

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,

        // 清除目录
        clean: {
            html: ["dist/*.html", "dist/*.php"],
            images: ["dist/images", "dist/pic"],
            css: ["dist/css/*.css"],
            js: ["dist/js/*.js"],
            module: ["dist/js/module/*.js"],
            plugin: ["dist/js/plugin/*.js"]
        },

        // 静态资源添加版本号
        cache_control: {
            html: {
                source: ['dist/*.html', 'dist/*.php'],
                options: {
                    version: version,
                    links: true,
                    scripts: true,
                    replace: true,
                    ignoreCDN: true
                }
            }
        },

        // 图片压缩
        imagemin: {                          // Task
            target: {                         // Another target
                options: {
                    optimizationLevel: 0   // png图片优化水平，3是默认值，取值区间0-7
                },
                files: [
                    {
                        expand: true,                  // Enable dynamic expansion
                        cwd: 'src/images/',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'dist/images/'
                    },
                    {
                        expand: true,                  // Enable dynamic expansion
                        cwd: 'src/pic/',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'dist/pic/'
                    }
                ]
            }
        },

        // html文件压缩
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
                    src: ['*.html', '*.php'],
                    dest: 'dist/'
                }]
            }
        },

        // less文件编译
        less: {
            dist: {
                options: {                       // Target options
                    strictMath: true,
                    strictUnits: false
                },
                files: [{
                    expand: true,
                    cwd: 'src/less',
                    src: ['*.less'],
                    dest: 'src/css',
                    ext: '.css'
                }]
            }
        },

        // css文件压缩
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css'],
                    dest: 'dist/css/'
                }]
            }
        },

        // js文件压缩
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
                dest: 'dist/js/'
            },
            module: {
                expand: true,
                cwd: 'src/js/module',
                src: ['*.js'],
                dest: 'dist/js/module/'
            },
            plugin: {
                expand: true,
                cwd: 'src/js/plugin',
                src: ['*.js'],
                dest: 'dist/js/plugin/'
            }
        },

        // html5缓存文件生成
        manifest: {
            generate: {
                options: {
                    basePath: './dist/',
                    cache: [
                        'js/plugin/sea.js?v=' + version
                    ],
                    network: ['*'],
                    fallback: [],
                    exclude: [],
                    preferOnline: true,
                    headcomment: " <%= pkg.name %> v" + Date.now(),
                    verbose: true,
                    timestamp: true,
                    hash: true,
                    master: ['index.html'],
                    process: function(path) {
                        if(/(css|js)$/i.test(path)){
                            return path + '?v=' + version;
                        } else {
                            return path;
                        }
                    }
                },
                src: [
                    '*.html',
                    'css/*.css',
                    'js/*.js'
                ],
                dest: 'dist/manifest.appcache'
            }
        },

        // 监听文件修改
        watch: {
            html: {
                files: ['src/*.html', 'src/*.php'],
                tasks: ['newer:clean:html', 'newer:htmlmin', 'cache_control', 'manifest']
            },
            images: {
                files: ['src/images/*', 'src/pic/*'],
                tasks: ['newer:clean:images', 'newer:imagemin', 'cache_control', 'manifest']
            },
            less: {
                files: 'src/less/*.less',
                tasks: ['less']
            },
            css: {
                files: 'src/css/*.css',
                tasks: ['newer:clean:css', 'newer:cssmin', 'cache_control', 'manifest']
            },
            js: {
                files: 'src/js/*.js',
                tasks: ['newer:clean:js', 'newer:uglify:js', 'cache_control', 'manifest']
            },
            module: {
                files: 'src/js/module/*.js',
                tasks: ['newer:clean:module', 'newer:uglify:module', 'cache_control', 'manifest']
            },
            plugin: {
                files: 'src/js/plugin/*.js',
                tasks: ['newer:clean:plugin', 'newer:uglify:plugin', 'cache_control', 'manifest']
            }
        }
    });

    grunt.loadNpmTasks('grunt-cache-control');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-manifest');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['clean', 'htmlmin', 'uglify', 'less', 'cssmin', 'imagemin', 'cache_control', 'manifest', 'watch']);
    grunt.registerTask('js', ['clean:js', 'clean:module', 'clean:plugin', 'uglify', 'cache_control', 'manifest']);
    grunt.registerTask('css', ['clean:css', 'less', 'cssmin', 'cache_control', 'manifest']);
    grunt.registerTask('html', ['clean：html', 'htmlmin', 'cache_control', 'manifest']);
    grunt.registerTask('images', ['clean:images', 'cssmin', 'cache_control', 'manifest']);
};