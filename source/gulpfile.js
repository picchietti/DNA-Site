// warning: this file is still a work in progress, but works well enough to use for most cases.

var gulp = require('gulp');
var sass = require('gulp-sass');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var minify_css = require('gulp-clean-css');
var pump = require('pump');
var jsonminify = require('gulp-jsonminify');

var del = require('del');
var glob = require("glob");

var home = process.env['HOME'];
var path_one_up = home + '/Desktop/github/';
var path_input = path_one_up + 'dnadiscovery.net/source';
var path_output = path_one_up + 'dnadiscovery.net';
var path_input_slash = path_input + '/';
var path_output_slash = path_output + '/';

function array_diff(a, b){
  var hash = {};
  b.forEach(function (v) { hash[v] = true });
  return a.filter(function (v) { return !hash.hasOwnProperty(v); });
}

gulp.task('clean', function() {
  // removes files from release that are no longer in source
  var files_release = glob.sync('!' + path_input_slash, {
    dot: true,
    cwd: path_output_slash
  });
  var files_server = glob.sync('**/*', {
    dot: true,
    cwd: path_input_slash
  });

  var to_delete = array_diff(files_release, files_server);

  to_delete = to_delete.map(function(file){
    return path_output_slash + file
  })

  del.sync(to_delete, {
    force: true
  });
});

gulp.task('sync', ['clean'], function() {
  return gulp
    .src([
			path_input_slash + '**',
			'!' + path_input_slash + '{node_modules,node_modules/**}',
			'!' + path_input_slash + 'gulpfile.js',
			'!' + path_input_slash + 'package.json',
			'!' + path_input_slash + 'docker-compose.yml'
		], {
      dot: true
    })
    .pipe(changed(path_output_slash, {
      hasChanged: changed.compareSha1Digest
    }))
    .pipe(gulp.dest(path_output_slash));
});

gulp.task('scss', ['sync'], function(){
  return gulp
    .src([
      path_output_slash + '**/*.scss',
      '!' + path_input_slash + '**/*.scss'
    ])
    .pipe(sass())
    .pipe(gulp.dest(path_output_slash));
});

gulp.task('css', ['sync', 'scss'], function() {
  // don't leave scss files
  del.sync(path_output_slash + '**/*.scss', {
    force: true,
    cwd: path_output_slash,
    ignore: path_input_slash + '**/*.scss'
  });

  return gulp
    .src([
      path_output_slash + '**/*.css',
      '!' + path_output_slash + '**/*.min.css',
      '!' + path_input_slash + '**/*.css'
    ])
    .pipe(minify_css())
    .pipe(gulp.dest(path_output_slash));
});

gulp.task('js', ['sync'], function(cb) {
  pump([
		gulp.src([
			path_output_slash + '**/*.js',
			'!' + path_output_slash + '**/*.min.js',
			'!' + path_input_slash + '**/*.js'
		]),
		uglify(),
		gulp.dest(path_output_slash)
	], cb);
});

gulp.task('json', ['sync'], function () {
  return gulp
    .src([
			path_output_slash + '**/*.json',
			'!' + path_input_slash + '**/*.json'
		])
    .pipe(jsonminify())
	  .pipe(gulp.dest(path_output_slash));
});

gulp.task('html', ['sync'], function() {
  return gulp
    .src([
      path_output_slash + '**/*.html',
      '!' + path_output_slash + 'google1341bc3277bdc766.html',
      '!' + path_input_slash + '**/*.html'
    ])
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(path_output_slash));
});

gulp.task('watch', function(){
  // one giant watch all that checks the extension and the event to determine the action to take for the file.
  gulp.watch([
    path_input_slash + '**/*'
    // '!' + 'server/' + '/google1341bc3277bdc766.html' // not likely to ever be added, renamed, removed, changed
  ], {cwd: path_one_up}, function(event){
    var dest_file = event.path.replace(path_input, path_output);
    var dest_path = dest_file.substring(0, dest_file.lastIndexOf("/"));

    if(event.type == 'deleted'){
      return del.sync(dest_file, {
        force: true
      });
    }

    if(event.type == 'added'){
      gulp
        .src(event.path)
        .pipe(gulp.dest(dest_path));

      return process_file(event.path);
    }

    if(event.type == 'renamed'){
      var dest_old = event.old.replace(path_input, path_output);

      // TODO: get gulp rename to work instead of copy and deleting.
      gulp
        .src(event.path)
        .pipe(gulp.dest(dest_path));

      // in case an ext is added.
      process_file(event.path);

      return del.sync(dest_old, {
        force: true
      });
    }

    if(event.type == 'changed'){
      return process_file(event.path);
    }
  })
});

function process_file(event_path){
  var dest_file = event_path.replace(path_input, path_output);
  var dest_path = dest_file.substring(0, dest_file.lastIndexOf("/"));

  var base_name = event_path.substring(event_path.lastIndexOf('/')+1);
  var exts = base_name.substring(base_name.indexOf('.')+1).split('.');

  // for now, for my needs, don't bother with .min files
  if(exts.indexOf('min') !== -1)
    return;

  while(exts.length != 0){
    var last_ext = exts.pop();
    switch (last_ext) {
      case 'scss':
      // updates css but not scss in output... not exactly a problem. should get rid of scss files in release anyways.
        return gulp
          .src(event_path)
          .pipe(sass())
          .pipe(minify_css())
          .pipe(gulp.dest(dest_path));
      break;
      case 'css':
        return gulp
          .src(event_path)
          .pipe(minify_css())
          .pipe(gulp.dest(dest_path));
      break;
      case 'html':
        return gulp
          .src(event_path)
          .pipe(htmlmin({
            collapseWhitespace: true
          }))
          .pipe(gulp.dest(dest_path));
      break;
      case 'js':
        return pump([
					gulp.src(event_path),
					uglify(),
					gulp.dest(dest_path)
				])
      break;
			case 'json':
        return gulp
          .src(event_path)
          .pipe(jsonminify())
          .pipe(gulp.dest(dest_path));
      break;
    }
  }
}

gulp.task('build', function(){
  gulp.start('css', 'js', 'html', 'json');
});

gulp.task('default', function(){
  gulp.start('css', 'js', 'html', 'json');
});
