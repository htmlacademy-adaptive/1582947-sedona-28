import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import browser from 'browser-sync';
import del from 'del';
import rename from 'gulp-rename';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso ()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML
const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

//scripts
const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
}


const optimazeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'))
}

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'))
}

//SVG
const svg = () => {
  return gulp.src(['source/img/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
}
// const sprite = () => {
//   return gulp.src('source/img/icons/*.svg')
//   .pipe(svgo())
//   .pipe(svgstore({
//     inlineSvg: true
//   }))
//   .pipe(rename('sprite.svg'))
//   .pipe(gulp.dest('build/img'));
// }


// copy
const copy = (done) => {
  gulp.src ([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico}',
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
}

//clean
const clean = () => {
  return del('build');
};

//server

const server = (done) => {
  browser.init ({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//reload
const reload = (done) => {
  browser.reload();
  done();
}


// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export const build = gulp.series (
  clean,
  copy,
  optimazeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    // sprite,
    createWebp
  ),
);

export default gulp.series (
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    // sprite,
    createWebp
  ),
gulp.series(
  server,
  watcher
));
