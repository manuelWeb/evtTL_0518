var gulp          = require('gulp'),
    browserSync   = require('browser-sync'),
    slim          = require("gulp-slim"),
    sass          = require('gulp-sass'),
    plumber       = require('gulp-plumber'),
    autoprefixer  = require('gulp-autoprefixer'),
    rename        = require('gulp-rename'),
    using         = require('gulp-using'),
    rm            = require('gulp-rimraf'),
    rimraf        = require('rimraf'),
    gulprunseq    = require('gulp-run-seq'),
    sourcemaps    = require('gulp-sourcemaps'),
    imgmin        = require('gulp-imagemin'),
    replace       = require('gulp-replace'),
    changed       = require('gulp-changed'),
    zip           = require('gulp-zip'),
    prettify      = require('gulp-html-prettify'),
    foreach       = require("gulp-foreach")
    fs            = require('fs'),
    ncp           = require('ncp').ncp,
    config        = require("./config.json");

// src & output
var src    = 'src/**/',
    img    = 'src/**/*.{png,jpg,gif,svg}'
    dest   = 'dev/',
    date   = config.date,
    thname = config.projectname;
// delete old folder before start dev task
gulp.task('dev', function (cb) {
  rimraf('./dev', function cb () {
    console.log('evtProd folder have been destroyed!');
    rimraf('./preview', function cb () {
      console.log('preview folder have been destroyed!');
      rimraf('./zipped', function cb () {
        console.log('zipped is destroyed : clean is over!\nlet\'s work on clean folder!');
        gulp.start('dev1');
      });
    });
  });
});
/*=================================
=            task init            =
=================================*/
// browser-sync task !attention index.html require
gulp.task('browserSync',function () {
  browserSync({
    // browser: 'chrome',
    server: {
      baseDir: 'dev/FR'
    }
  });
});

// img task
// .pipe(plumber())
// .pipe(npm()) // img optimize
// .pipe(changed(src+'*.{png,jpg,gif,svg}'))
gulp.task('images', function() {
  return gulp.src([src+'*.{png,jpg,gif,svg}'])
  .pipe(using())
  .pipe(browserSync.reload({stream: true }))
  .pipe(gulp.dest(dest))
  .on('end',function () {
    // start slim to render
    gulp.start('slim');
  });
});

// sass task
gulp.task('sass', function() {
  return gulp.src(src+'*.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      // :nested :compact :expanded :compressed
      outputStyle: 'compact'
    }))
  // ne pas placer srcMap avant autoprefixer
  // ecrit srcMap dans style.css
  .pipe(sourcemaps.write())
  .pipe(autoprefixer(['last 2 version', '> 1%', 'ie >= 8']))
  .pipe(changed(dest))
  // .pipe(sourcemaps.write())
  // .pipe(sourcemaps.write('./'))
  // .pipe(rename(function(path) {
  //   path.dirname += "/../css";
  // }))
  .pipe(gulp.dest(dest))
  .pipe(using())
  .pipe(browserSync.reload({stream: true }));
});

// slim task
gulp.task('slim', function () {
  var slimEnd = false;
  // return gulp.src([src+'*.slim'])
  return gulp.src([src+'indexC.slim'])
  .pipe(plumber())
  .pipe(slim( {pretty: true, indent: '2' })) // {read:false},
  .pipe(rename({
    basename: "index",
    extname : ".html"
  }))
  .pipe(using())
  .pipe(gulp.dest(dest))
  .on('end',function () {
    slimEnd = true;
    messageSlimEnd(slimEnd);
  })
  .pipe(browserSync.reload({
    stream: true
  }))
});

function messageSlimEnd (slimEnd) {
  console.log('slimeEnd: '+slimEnd);
};

gulp.task('dev1',['browserSync','images','slim','sass'], function() {
  // gulp.watch([src+'**/*.{png,jpg,gif}'],['images']);
  gulp.watch(src+'*.{png,jpg,gif}',['images']);
  gulp.watch(src+'*.scss',['slim','sass','images']);
  gulp.watch(src+'*.slim',['slim','images']);
});

// prod

// replace ../images/src/ (css) & images/src/blabla (html)
gulp.task('killCssMap', function(){
  ncp(dest, 'preview/', function (err) {
   if (err) {
     return console.error(err);
   }
   console.log('done!');
  });
  // cp dest/styleZL.html in build/ + regex to replace src path
  gulp.src([dest+'**/index.css'])
    // del css map
    .pipe(replace(/\/\*.+?\*\//g, '/* end of zoneLibre css */'))
    .pipe(replace(", ", ','))
    .pipe(gulp.dest(dest))
    .pipe(using())
    .on('end',function () {
      replaceBool = true;
      killMapEnd(replaceBool);
      gulp.start('html');
    });

});

gulp.task('zipAllGuy',function () {
  // zipall files
  console.log('zipNow ???')

  // npm install --save-dev gulp-foreach
  // var foreach = require("gulp-foreach");
  return gulp.src("./dev/*")
    .pipe(foreach(function(stream, file) {
      var fileName = file.path.substr(file.path.lastIndexOf("\\") + 1);
      console.log('fileName ' + fileName + ' file ' + file.path)
      gulp.src("./dev/" + fileName + "/*")
        .pipe(zip(date + thname + fileName + ".zip"))
        .pipe(gulp.dest("./zipped"));

      return stream;
    }));// end foreach

  console.log('archive OK')

});

function killMapEnd (replaceBool) {
  console.log('replaceBool: '+replaceBool);
};
function htmlEnd (htmlEndBool) {
  console.log('go beau htmlEnd: '+htmlEndBool);
};

// @see http://maxogden.com/scraping-with-node.html
gulp.task('html', function() {
  var $ = require('cheerio');
  var fs = require('fs');
  var glob = require("glob");
  glob(dest+'**/index.html', function(err, files) {
    for (var i = files.length - 1; i >= 0; i--) {
      console.log('html path> '+files[i]);
      // pb .toString() not self-closed tag
      var htmlString = fs.readFileSync(files[i]).toString();
      var parsedHTML = $.load(htmlString);
      // console.log('htmlString> ' + htmlString);
      parsedHTML('body').map(function(arg, zoneL) {
        zoneL = $(zoneL);
        zoneL = zoneL.html()
        .replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1 />")
        .replace(/(<br[^/])/, "<br />")
        .replace(/&apos;/g, "'")
        .replace(/&#xC9;/g, "&Eacute;");
        console.log('html parse: ' + zoneL);
        
        if(i===0){
          console.log('all ok next ?');
          gulp.start('beau')
        };
        
        fs.writeFile(files[i], zoneL, 'utf8', function(err) {
          if (err) {
            return console.log(err);
          }else{
            console.log("The file was saved!");
          };
        });
      }); // end parseHTML

    };
  });
  // gulp.start('beau');
  
})

gulp.task('beau', function () {
  console.log('task beau go!')
  gulp.src([dest+'**/index.html'])
  .pipe(prettify({indent_car:'', indent_size: 2}))
  .pipe(gulp.dest(dest))
  .on('end',function () {
    htmlEndBool = true;
    htmlEnd(htmlEndBool);
    gulp.start('zipAllGuy');
  });
});

gulp.task('build',['killCssMap']);
