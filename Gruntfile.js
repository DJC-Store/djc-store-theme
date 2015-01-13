module.exports = function(grunt) {

  var jsonFiles = [
    'theme.json',
    'theme-ui.json',
    'package.json',
    'labels/*.json'
  ],
    jsFiles = [
    'Gruntfile.js',
    'build.js',
    'scripts/**/*.js'
  ],
    filesToArchive = [
    '**',
    '!node_modules/**',
    '!references/**',
    '!tasks/**',
    '!configure.js',
    '!Gruntfile.js',
    "!*.zip"
  ],

versionCmd = 'git describe --tags --always'; // e.g. 'git describe --tags --always' or 'svn info'

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    theme: grunt.file.readJSON('theme.json'),
    jsonlint: {
      theme_json: {
        src: jsonFiles
      }
    },
    jshint: {
      theme_js: jsFiles,
      options: {
        ignores: ['scripts/vendor/**/*.js'],
        undef: true,
        laxcomma: true,
        unused: false,
        globals: {
          console: true,
          window: true,
          document: true,
          setTimeout: true,
          clearTimeout: true,
          module: true,
          define: true,
          require: true,
          Modernizr: true,
          process: true
        }
      }
    },
    zubat: {
      main: {
        dir: '.',
        manualancestry: ['./references/<%= theme.about.extends %>'],
        ignore: ['/references','\\.git','node_modules','^/resources','^/tasks','\\.zip$']
      }
    },
    compress: {
      build: {
        options: {
          archive: '<%= pkg.name %>.zip',
          pretty: true
        },
        files: [{
          src: filesToArchive,
          dest: '/'
        }]
      }
    },
    watch: {
      json: {
        files: jsonFiles,
        tasks: ['jsonlint']
      },
      javascript: {
        files: jsFiles,
        tasks: ['jshint','zubat']
      },
      compress: {
        files: filesToArchive,
        tasks: ['compress']
      }
    },
    setver: {
      release: {
        cmd: versionCmd,
        themejson: true,
        packagejson: true,
        readmemd: true
      },
      build: {
        cmd: versionCmd,
        themejson: true,
      },
      renamezip: {
        cmd: versionCmd,
        filenames: ["<%= pkg.name %>.zip"]
      }
    }
  });

  [
   'grunt-jsonlint',
   'grunt-contrib-jshint',
   'grunt-contrib-watch',
   'grunt-contrib-compress'
  ].forEach(grunt.loadNpmTasks);

  grunt.loadTasks('./tasks/');

  grunt.registerTask('build', ['jsonlint', 'jshint', 'checkreferences', 'zubat', 'setver:build', 'compress', 'setver:renamezip']);
  grunt.registerTask('release', ['jsonlint', 'jshint', 'zubat', 'setver:release', 'compress', 'setver:renamezip']);
  grunt.registerTask('default', ['build']);
};
