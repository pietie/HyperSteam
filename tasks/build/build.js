'use strict';

var pathUtil = require('path');
var Q = require('q');
var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var del = require('del');

var bundle = require('./bundle');
var generateSpecImportsFile = require('./generate_spec_imports');
var utils = require('../utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

var tsc = require('gulp-typescript');
var path = require('path');

var paths = {
    copyFromAppDir: [
     //   './node_modules/**', 
       // './**/*.js',
        './helpers/**',
        './src/**',
        './**/*.html',
        './**/*.css',
        './**/*.+(jpg|png|svg)',
         '!./node_modules/**', // too large, need a smarter solution!
//        '!./node_modules/@angular/**', // too large, need a smarter solution!
    ],
};

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function () {
    return del([
            './build/**/**',
            '!./build/node_modules/**',
            '!./build',
        ], {dryRun:false}).then(paths => {
        console.log('Files and folders that would be deleted:\n', paths.join('\n'));
    });

});


var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
            overwrite: true,
            matching: paths.copyFromAppDir
        });
};
gulp.task('copy', ['clean'], copyTask);
gulp.task('copy-watch', copyTask);


var bundleApplication = function () {
    return Q.all([
            bundle(srcDir.path('background.js'), destDir.path('background.js')),
            bundle(srcDir.path('app.js'), destDir.path('app.js')),
            
            bundle(srcDir.path('main.js'), destDir.path('main.js')),
            bundle(srcDir.path('main.component.js'), destDir.path('main.component.js'))
        ]);
};

var bundleSpecs = function () {
    return generateSpecImportsFile().then(function (specEntryPointPath) {
        return bundle(specEntryPointPath, destDir.path('spec.js'));
    });
};

var bundleTask = function () {
    if (utils.getEnvName() === 'test') {
        return bundleSpecs();
    }
    return bundleApplication();
};
gulp.task('bundle', ['clean'], bundleTask);
gulp.task('bundle-watch', bundleTask);


var lessTask = function () {
    return gulp.src('app/stylesheets/main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(destDir.path('stylesheets')));
};
gulp.task('less', ['clean'], lessTask);
gulp.task('less-watch', lessTask);


gulp.task('finalize', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');

    // Add "dev" or "test" suffix to name, so Electron will write all data
    // like cookies and localStorage in separate places for each environment.
    switch (utils.getEnvName()) {
        case 'development':
            manifest.name += '-dev';
            manifest.productName += ' Dev';
            break;
        case 'test':
            manifest.name += '-test';
            manifest.productName += ' Test';
            break;
    }

    // Copy environment variables to package.json file for easy use
    // in the running application. This is not official way of doing
    // things, but also isn't prohibited ;)
    manifest.env = projectDir.read('config/env_' + utils.getEnvName() + '.json', 'json');

    destDir.write('package.json', manifest);
});


gulp.task('watch', function () {
    watch('app/**/*.js', batch(function (events, done) {
        gulp.start('bundle-watch', done);
    }));
    watch(paths.copyFromAppDir, { cwd: 'app' }, batch(function (events, done) {
        gulp.start('copy-watch', done);
    }));
    watch('app/**/*.less', batch(function (events, done) {
        gulp.start('less-watch', done);
    }));
});



//////////////////////////
    var DEBUG = true;

    var config = {
        allTypeScriptBase: "app",
        allTypeScript: 'app/**/*.ts',
        tsOutputPath: "."
    } ;


var tsProject = tsc.createProject('./app/tsconfig.json');


function compileSpecificTypeScriptFile(srcPath) {
    var srcRelative = path.relative("./" + config.allTypeScriptBase, srcPath);
    //var outputPath = path.join(config.tsOutputPath, path.dirname(srcRelative));
    var outputPath = path.dirname(srcPath);
   
   //console.log("out: %s", outputPath);
    
    var tsResult = gulp.src(srcPath).pipe(tsc(tsProject));

    tsResult.dts.pipe(gulp.dest(outputPath));

    return tsResult.js.pipe(gulp.dest(outputPath));
}

gulp.task('watchTypeScript', function () {
    gulp.watch([config.allTypeScript], function (obj) {
        try {
            console.log("TSC \t%s\t%s", obj.type.toUpperCase(), obj.path);
            
            if (obj.type === 'changed' || obj.type === 'added' || obj.type === 'renamed') {
                return compileSpecificTypeScriptFile(obj.path);
            }
            else if (obj.type === "deleted") { // delete the compiled javascript file
console.error("TODO: TS delete");

//TODO:?!?!?!
                // find the relative path from the base src directory
                // var srcRelative = path.relative("./" + config.allTypeScriptBase, obj.path);
                
                // //var rel  = path.relative("./", obj.path);
                // var pathToJs = path.join(config.tsOutputPath, srcRelative).replace(".ts", ".js");

                // del(pathToJs).then(function (paths) {
                //     console.log('\tDELETED\t%s\t(2)', paths.join(','));
                // });

            }
        }
        catch (e) {
            console.log(e.toString());
        }
    });



    ////// (COPY TO OUPUT)
    //  Watch for auto-generated .js and other static files
    //  Keeps these file in sync with bin\Debug or bin\Release
    //  This is necessary because we run our own web server in this service (OWIN)
    // gulp.watch([config.copyOutputWatch, "!" + config.allTypeScript], function (obj) {
    //     console.log("SYNC \t%s\t%s", obj.type.toUpperCase(), obj.path);

    //     if (obj.type === 'changed' || obj.type === 'added' || obj.type === 'renamed') {
    //         // copy to BIN
    //         return gulp.src(obj.path, { "base": "./" }).pipe(gulp.dest(config.copyOutputBase, { mode: 666 }));
    //     }
    //     else if (obj.type === "deleted") {
    //         // map relative path of deleted file to where it was copied (copyToOutput)
    //         var pathToDel = path.join(config.copyOutputBase, path.relative("./", obj.path));

    //         del(pathToDel).then(function (paths) {
    //             console.log('\tDELETED\t%s\t(1)', paths.join(','));
    //         });
    //     }
    // });



});


///////////////////////



gulp.task('build', ['bundle', 'less', 'copy', 'finalize', 'watchTypeScript']);
