module.exports = function(config){
  config.set({

    basePath : 'app',

    files : [
      'lib/angular.min.js',
      'lib/angular-route.min.js',
      'lib/angular-ui-router.min.js',
      'lib/angular-mocks.js',
      'js/*.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    reporters: ['dots'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-spec-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    singleRun: false


  });
};