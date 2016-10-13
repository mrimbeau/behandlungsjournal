'use strict';
const gulp = require('gulp');
const gutil = require('gulp-util');
const gts = require('gulp-typescript');
const tsProject = gts.createProject("server/tsconfig.json");
// Gulp typescript 3.0.2

gulp.task('ts', tsc);

function tsc() {
    gutil.log("tsc aufruf");
    tsProject.src()
        .on('error', gutil.log)
        .pipe(tsProject())
        .pipe(gulp.dest("dist/"));
}
tsc.description=`ExpressServer: JS-Generierung mit Typescript (tsconfig.json)`;
