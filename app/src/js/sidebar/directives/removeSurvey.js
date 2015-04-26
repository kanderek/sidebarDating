angular.module('RemoveSurveyDirective', ['appServices', 'SurveyModule'])
    .directive('removeSurvey', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/removeSurvey.html',
            scope: {
                selfid: '@'
            },
            link: link,
            controller: 'removeSurveyController',
            controllerAs: 'rsc'
        };
    }])
    .controller('removeSurveyController',
      [
        '$rootScope',
        '$scope',
        '$location',
        'SurveyService',
        'DancecardService',

        function ($rootScope, $scope, $location, SurveyService, DancecardService) {

      var _this = this;

      var userDetails = DancecardService.getStagedUser();

      $scope.survey = {
          chemistry: false,
          goals: false,
          personality: false,
          conversation: false,
          different: false,
          textReason: ""
      };

      if (userDetails) {
          $scope.username = userDetails.username;
          $scope.userid = userDetails.userid;
      }

      $scope.cancel = function () {
        $rootScope.back();
      };

      $scope.submitSurvey = function () {

        console.log('submitting remove survey for userid: ' + $scope.userid);
        SurveyService.submitSurvey(_.extend($scope.survey, {userid: $scope.selfid, recipientid: $scope.userid}));
        DancecardService.removeFromDancecard($scope.selfid, $scope.userid)
          .then(function () {
             $location.url('/testing/home');
          });
      };
      
    }]);


