module.exports = function(grunt) {

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  karma: {
      unit: {
          configFile: 'karma.conf.js',
          background: true
      }
    },
  watch: {
      karma: {
          files: ['content.js', 'test/unit/**/*.js'],
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

grunt.registerTask('devmode', ['karma:unit', 'watch']);

grunt.registerTask('test_node', ['jasmine_node']);
grunt.registerTask('default', ['test_node']);


};
