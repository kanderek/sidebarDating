module.exports = function(grunt) {

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
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

grunt.registerTask('test_node', ['jasmine_node']);
grunt.registerTask('default', ['test_node']);

};