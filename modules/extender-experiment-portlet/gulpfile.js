'use strict';

var Promise = require('bluebird');

var gulp = require('gulp');
var gulpIgnore = require('gulp-ignore');

// Handling of node_modules packaging
var readPackageJson = require('read-package-json');
var resolveModule = require('resolve');
var path = require('path');

function getPackageDependencies(basedir) {
	return new Promise(function(resolve, reject) {
		readPackageJson(basedir + '/package.json', false, function (err, data) {
			if (err) {
				reject(err);
			} else {
				var promises = [];

				Object.keys(data.dependencies).forEach(function(dependency) { 
					var dependencyDir = getDependencyDir(basedir, dependency)
					
					promises.push(getPackageDependencies(dependencyDir));
				});
				
				var pkgs = {};
				
				var pkgId = data.name + '@' + data.version;

				pkgs[pkgId] = {
					id: pkgId,
					name: data.name,
					version: data.version,
					dir: basedir
				};

				Promise.all(promises).then(
					function(dependencyPkgs) {
						dependencyPkgs.forEach(function(dependencyPkg) {
							Object.keys(dependencyPkg).forEach(function(pkgId) {								
								pkgs[pkgId] = dependencyPkg[pkgId];
							});
						});

						resolve(pkgs);
					},
					function(err) {reject(err)}
				);
			}		 
		});
	});
}

function getDependencyDir(packageDir, dependency) {
	var moduleFile = resolveModule.sync(dependency, { basedir: packageDir });
	
	var dependencyDir = path.dirname(moduleFile);
	
	while (!path.dirname(dependencyDir).endsWith('node_modules')) {
		dependencyDir = path.dirname(dependencyDir);
	}
	
	return dependencyDir;
}

gulp.task('package-npm', function() {
	getPackageDependencies('.').then(
		function(pkgs) {
			Object.values(pkgs).forEach(function(pkg) {
				var srcFiles = pkg.dir + '/**/*';
				// Versioned flat style deps -> var outputDir = './build/resources/main/META-INF/resources/node_modules/' + pkg.id;
				var outputDir = './build/resources/main/META-INF/resources/' + path.relative('.', pkg.dir);
				
				if (srcFiles === './**/*') {
					return;
				}
				
				gulp.src(srcFiles)
					.pipe(gulpIgnore.exclude('node_modules'))
					.pipe(gulpIgnore.exclude('node_modules/**/*'))
					.pipe(gulp.dest(outputDir));
			});
		}, 
		function(err) {console.log(err)}
	);
});

gulp.task('copy-package-json', function() {
	gulp.src('./package.json')
		.pipe(gulp.dest('build/resources/main/META-INF/resources'))
});

// Handling of ES2015 transpilation
const babel = require('gulp-babel');
var babelPluginModules = require('babel-plugin-transform-es2015-modules-commonjs');
// this the plugin that metal-cli uses -> var babelPluginModules = require('babel-plugin-transform-es2015-modules-amd');

gulp.task('transpile', function() {
	var srcFiles = 'src/main/resources/META-INF/resources/**/*.es.js';
	var outputDir = 'build/resources/main/META-INF/resources';
	
	// https://github.com/metal/metal-tools-build-amd/blob/master/lib/pipelines/buildAmd.js#L26
	var options = {
		compact: false,
    plugins: [babelPluginModules],
    presets: ['es2015'],
    // sourceMaps: options.sourceMaps
	};

	return gulp.src(srcFiles)
	        .pipe(babel(options))
	        .pipe(gulp.dest(outputDir));
					
					
	// var result = babel.transformFileSync(
	// 	'src/main/resources/META-INF/resources/lib/index.es.js', 
	// 	options
	// );
	// 
	// console.log(result.code);
});

// Define build's default target
gulp.task('default', ['package-npm', 'copy-package-json', 'transpile']);
