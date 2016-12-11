
var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var zip = require('gulp-zip');
 
var tsConfig = {
   // noExternalResolve: true,
    target: 'ES5',
   // declarationFiles: true,
   // experimentalDecorators: true,
   // isolatedModules: false
};

var tsProject = ts.createProject(tsConfig);
 
 
gulp.task('scripts', function () {
    
    var tsResult = gulp.src(['src/ts/*.ts', 'node_modules/babylonjs/babylon.d.ts'])
        .pipe(sourcemaps.init()) // sourcemaps are created
        .pipe(tsProject());
        
    return tsResult
         .pipe(concat('output.js')) 
     //    .pipe(uglify()) 
         .pipe(sourcemaps.write()) // sourcemaps are added to the .js file 
         .pipe(gulp.dest('build/'));

});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('src/*.ts', ['scripts']);
});

gulp.task('webserver', function () {
    gulp.src(['src','build']).pipe(webserver({
      port: 8000,
      livereload: false
    }));
});

gulp.task('run', ['watch', 'webserver'], function () {

});

gulp.task('dist', function () {
    return gulp.src(['./src/*','./*.js*'], { base: './' })
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./dist'));
});

