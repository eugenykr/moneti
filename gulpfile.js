//paths for source and bundled parts of app
var basePaths = {
    src: 'src/',
    dest: 'assets/',
    npm: 'node_modules/'
};

var gulp = require('gulp');

var es          = require('event-stream'),
    gutil       = require('gulp-util'),    
    bourbon     = require('node-bourbon'),
    path        = require('relative-path'),
    runSequence = require('gulp4-run-sequence'),
    importCss   = require('gulp-import-css'),
    del         = require('del');

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var sassStyle = 'expanded';
var sourceMap = true;
var isProduction = false;

if ( true === gutil.env.prod ) {
	isProduction = true;
	sassStyle = 'compressed';
	sourceMap = false;
}

//isProduction = true;

//log
var changeEvent = function(evt) {
    gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

//js
gulp.task('build-js', function() {
    var appFiles = [
        'node_modules/jquery/dist/jquery.min.js',
        basePaths.src+'js/*.js',
    ];

    return gulp.src(appFiles, {allowEmpty: true})
        .pipe(plugins.concat('bundle.js'))
        .pipe(isProduction ? plugins.uglify() : gutil.noop())
        .pipe(plugins.size())
        .on('error', console.log)
        .pipe(gulp.dest(basePaths.dest+'js'))
});

//sass
gulp.task('build-css', function() {
    var paths = require('node-bourbon').includePaths;
    var vendorFiles = gulp.src([
                        basePaths.src + 'css/*.css'], {allowEmpty: true}),
        appFiles = gulp.src([basePaths.src+'sass/main.scss'])
        .pipe(!isProduction ? plugins.sourcemaps.init() : gutil.noop())
        .pipe(plugins.sass({
                outputStyle: sassStyle,
                includePaths: paths
            }).on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer({
                overrideBrowserslist: ['last 4 versions'],
                cascade: false
            }))
        .pipe(!isProduction ? plugins.sourcemaps.write() : gutil.noop())
        .on('error', console.log);

    return es.concat(vendorFiles, appFiles)
        .pipe(plugins.concat('bundle.css'))
        .pipe(isProduction ? plugins.cssmin() : gutil.noop())
        .pipe(plugins.size())
        .pipe(gulp.dest(basePaths.dest+'css'))
        .on('error', console.log);
});

//revision
gulp.task('revision-clean', function(){
    return del([basePaths.dest+'rev/**/*']);
});

gulp.task('revision', function(){    
    
    return gulp.src([basePaths.dest+'css/*.css', basePaths.dest+'js/*.js'])
        .pipe(plugins.rev())
        .pipe(gulp.dest( basePaths.dest+'rev' ))
        .pipe(plugins.rev.manifest())        
        .pipe(gulp.dest(basePaths.dest+'rev'))
        .on('error', console.log);
});


//builds
gulp.task('full-build', function(callback) {
    runSequence(
        'build-css',
        'build-js',
        'revision-clean',
        'revision',
        callback);
});

//svg - combine and clear svg assets
//@todo combine into one file
gulp.task('svg-opt', async function() {

    var icons = gulp.src([basePaths.src+'svg/**/icon-*.svg'])
        .pipe(plugins.cheerio({
            run: function ($) { //remove fill from icons
                $('[fill]').removeAttr('fill');
                $('[fill-rule]').removeAttr('fill-rule');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        })),
        pics = gulp.src([basePaths.src+'svg/pic-*.svg']),
        symbolSvg = es.concat(icons, pics)
        .pipe(plugins.svgstore()) //combine for inline usage
        .pipe(plugins.svgmin((file) => {
            return {
                plugins: [{
                    cleanupIDs: false,
                    removeUselessStrokeAndFill: false
                }]
            }
        }))
        .pipe(gulp.dest(basePaths.dest+'svg')),
        cssSvg = es.concat(icons, pics)
        .pipe(plugins.svgSprite({
                mode: {
                    stack: { sprite: "../css.svg" }
                },
            }
        ))
        .pipe(gulp.dest(basePaths.dest+'svg'));

    return plugins.merge(symbolSvg, cssSvg);

});

//watchers
gulp.task('watch', function(){
    gulp.watch([basePaths.src+'sass/*.scss', basePaths.src+'sass/**/*.scss', basePaths.src+'js/*.js'], gulp.series( 'full-build' )).on('change', function(evt) {
        //changeEvent(evt);
    });
});

//default
gulp.task( 'default', gulp.series( 'full-build', 'watch' ) );