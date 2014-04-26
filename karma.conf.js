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

    autoWatch : false,//true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-spec-reporter',
            'karma-junit-reporter',
            'karma-jasmine'
    ],  

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    singleRun: false


  });
};