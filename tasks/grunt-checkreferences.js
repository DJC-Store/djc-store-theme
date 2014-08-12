'use strict';

module.exports = function(grunt) {
  grunt.registerTask('checkreferences', 'Check to see if core has updated', function() {
    var done = this.async(),
    semver = require('semver'),
    bower = require('bower');
    ([4,5]).reduceRight(function(cb, ver) {
      var currentVersion;
      try {
        currentVersion = JSON.parse(require('fs').readFileSync('./references/core' + ver + '/bower.json', 'utf-8')).version;
      } catch(e) {
        console.log(e.message);
        grunt.fail.warn('Core' + ver + ' theme must be installed in order to update references.');
      }
      return function() {
        bower.commands.info('mozu/core-theme#^' + ver).on('end', function(json) {
          grunt.log.ok('Installed version of Core' + ver + ' is ' + currentVersion);
          grunt.log.ok('Latest version of Core' + ver + ' is ' + json.version);
          if (semver.gt(json.version, currentVersion)) {
            grunt.fail.warn('Core' + ver + ' has updated in production! Run `grunt updatereferences` to update your local reference and check the repository for release notes.');
          }
          cb();
        })
      }
    }, done)();
  });
}