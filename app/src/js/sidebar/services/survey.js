/*******************************************************************************************************
SurveyService  */

angular.module('SurveyModule', []).factory('SurveyService',
  [
    '$http',

    function ($http) {

    var surveyResponse = {};

      function submitSurvey(surveyResponse, callback){
        console.log('.....submitting survey to server....');
        console.log(surveyResponse);

        $http({
          method: 'POST',
          url: SERVER + "/survey",
          data: surveyResponse,
        }).
        success(function(data, status, headers, config){
          callback(data);

        }).
        error(function(data, status, headers, config){
          console.log('error submitting survey');
        });
      }

      return {
        submitSurvey: submitSurvey
      };
    }
  ]);