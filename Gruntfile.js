module.exports = function(grunt) {

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  karma: {
          unit: {
              configFile: 'config/karma.conf.js',
              background: true
          },
          travis: {
                configFile: 'config/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
      },
  watch: {
      karma: {
          files: ['src/**/*.js', 'test/unit/**/*.js'],
          tasks: ['karma:unit:run']
      }
  },
  jasmine_node: {
    options: {
      forceExit: true,
      match: '.',
      matchall: false,
      extensions: 'js',
      specNameMatcher: 'spec',
      jUnit: {
        report: true,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    },
    all: ['*/spec/']
  }
});

grunt.loadNpmTasks('grunt-jasmine-node');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-karma');

grunt.registerTask('test_angular', ['karma:travis']);
grunt.registerTask('test_node', ['jasmine_node']);
grunt.registerTask('default', ['test_angular', 'test_node']);

grunt.registerTask('devmode', ['karma:unit', 'watch']);

};