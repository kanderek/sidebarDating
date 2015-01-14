/*******************************************************************************************************
Remove surveyController  */

appControllers.controller('RemoveSurveyCtrl', ['$scope', '$state', 'Profile', 'UiState', 'DancecardService', 'SurveyService',
  function($scope, $state, Profile, UiState, DancecardService, SurveyService) {

    $scope.survey = {goals: false, personality: false, different: false, conversation: false, chemistry: false, textReason: ''};
    $scope.username = Profile.selectedForRemoval.username;
    $scope.hideButtons = false;

    $scope.cancel = function(){
      // UiState.showDetailsPanel = false;
      $scope.hideButtons = true;
      $state.go('main.profileList', {
          reload: true,
          inherit: false,
          notify: true
      });
    };


    $scope.submitSurvey = function(){
      var data = {
        userid: Profile.selfProfile.userid,
        partnerid: Profile.selectedForRemoval.userid,
        user_reason: $scope.survey.textReason,
        status: 'removed'
      };
        SurveyService.surveyResponse = $scope.survey;
        DancecardService.updateDancecard(data, Profile.selectedForRemoval);
        // UiState.showDetailsPanel = false;
        $state.go('main.profileList');
    };

    // $scope.$on('dancecard-removed', function(event){
    //   console.log('received message that dancecard was removed successfullly');

    // });

    }]);