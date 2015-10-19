/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e'
};

exports.cdnPrefix = 'http://cdn1.love.sl/love.sl/common/actions/charm/';

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/bootstrap\.js/],
  directory: 'bower_components',
  overrides: {
    bootstrap: {
      main: [
        //"less/bootstrap.less",
        "less/variables.less",
        "less/mixins.less",

        "less/normalize.less",

        "less/scaffolding.less",
        "less/grid.less",
        "less/forms.less",

        "less/navs.less",
        "less/navbar.less",

        "less/utilities.less",
        "less/responsive-utilities.less"
      ]
    }
  }

};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
