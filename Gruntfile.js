/*----------------------------------------------------
 * livereload Default Setting
 *-----------------------------------------------------*/
'use strict';
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var lrMiddleware = function(connect, options, middlwares) {
  return [
    lrSnippet,
    // 静态文件服务器的路径 原先写法：connect.static(options.base[0])
    serveStatic(options.base[0]),
    // 启用目录浏览(相当于IIS中的目录浏览) 原先写法：connect.directory(options.base[0])
    serveIndex(options.base[0])
  ];
};

/*----------------------------------------------------
 * Module Setting
 *-----------------------------------------------------*/
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		// Task htmlmin
		htmlmin: { 		
			dist: {
				options: {
					removeComments: true,		//去注析
					collapseWhitespace: true	//去换行
				},
				files: { // Dictionary of files
					'dist/html/index.html': ['src/html/index.html']
				}
			}
		},

		// Task jsmin
		uglify: {
			options: {
				mangle: false
			},
			build: {
				files: {
					'dist/js/comm.js': ['src/js/comm.js']
				}
			}
		},

		// Task cssmin
		cssmin: {
			/*
			compress: {
				files: {
				  'assets/all.min.css': ['css/a.css', 'css/b.css']
				}
			}, */
			
			/*
			smeite: {
				files: {
					'assets/smeite.all.css': ['/play21/smeite.com/public/assets/css/**.css']
				}
			},*/
			with_banner: {
				options: {
					banner: '/* projA Css files by Sonic */'
				},
				files: {
					'dist/css/combo.css': ['src/css/base.css','src/css/index.css']
				}
			}
		},

		 // Task imagemin
		 imagemin: {
			dist: { // Target
				options: { // Target options
					optimizationLevel: 3
				},
				files: { // Dictionary of files
					'dist/images/photo.png': 'src/images/photo.png', // 'destination': 'source'
					'dist/images/badge.jpg': 'src/images/badge.jpg'
				}
			}
		},

		/* S [Task liverload] --------------------------------------------------------------------------*/
		livereload: {
			port: 35729 // Default livereload listening port.
		},
		connect: {
			options: {
			// 服务器端口号
			port: 8000,
			// 服务器地址(可以使用主机名localhost，也能使用IP)
			hostname: 'localhost',
			// 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
			base: '.'
		  },
		  livereload: {
			options: {
			  // 通过LiveReload脚本，让页面重新加载。
			  middleware: lrMiddleware
			}
		  }
		},
		// Configuration to be run (and then tested)
		regarde: {
			html: {
				files: 'src/**/*.html',
				tasks: ['livereload']
			},
			css:{
				files: 'src/css/*.css',
				tasks: ['livereload']
			},
			js:{
				files: 'src/js/*.js',
				tasks: ['livereload']
			}
		}
		/* E--------------------------------------------------------------------------*/

	});

	// Load the plugin HTML/CSS/JS/IMG min
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	// Build task(s).
	grunt.registerTask('build', ['htmlmin', 'uglify', 'cssmin', 'imagemin']);

	/* [liverload plugin & task ] ---------------*/
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.registerTask('live', ['livereload-start', 'connect', 'regarde']);
};