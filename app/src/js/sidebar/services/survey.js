/*******************************************************************************************************
SurveyService  */

appServices.factory('SurveyService',
  [
    '$http',

    function ($http) {

    var surveyResponse = {};

      function submitSurvey(dancecardAction, callback){
        console.log('.....submitting survey to server....');
        console.log(surveyResponse);

        $http({
          method: 'POST',
          url: SERVER + "/survey",
          data: {
            survey: surveyResponse,
            dancecard: dancecardAction
          }
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