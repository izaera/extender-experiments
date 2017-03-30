'use strict';

var Promise = require('bluebird');

var gulp = require('gulp');
var gulpIgnore = require('gulp-ignore');

var readPackageJson = require('read-package-json');
var resolveModule = require('resolve');
var path = require('path');

/*
 * returns an array of packages 
 */
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

gulp.task('default', function() {
	getPackageDependencies('.').then(
		function(pkgs) {
			Object.values(pkgs).forEach(function(pkg) {
				var srcFiles = pkg.dir + '/**/*';
				var outputDir = 'build/resources/main/META-INF/resources/node_modules/' + pkg.id;
				
				if (srcFiles === './**/*') {
					return;
				}
				
				gulp.src(srcFiles)
					.pipe(gulpIgnore.exclude('node_modules'))
					.pipe(gulpIgnore.exclude('node_modules/**/*'))
					.pipe(gulp.dest(outputDir));
				
				console.log(srcFiles)
			});
		}, 
		function(err) {console.log(err)}
	);
});

