/*******************************************************************************************************
Ui Controller  */

appControllers.controller('uiCtrl',
  [
    '$rootScope',
    '$scope',
    '$timeout',
    '$state',
    'UiState',
    'Profile',
    'DancecardService',

  function (
    $rootScope,
    $scope,
    $timeout,
    $state,
    UiState,
    Profile,
    DancecardService
  ){

    $scope.uiState = UiState;

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
       //assign the "from" parameter to something
       // console.log('pervious state...');
       // console.log(from);
       UiState.previousState = from;
       UiState.currentState = to;
    });

    // $scope.showRemove = false;

    $rootScope.$on('ANGULAR_DRAG_START', function (event, channel) {
      console.log('drag started on dancecard....');
      //listen for "remove-person" channel
      //onoly do stuff with that channel

        console.log(event);
        console.log(channel);
        if(channel == 'remove-person'){
          $scope.$apply(function(){
                $scope.showRemove = true;
              });
        }
    });

    $rootScope.$on('ANGULAR_DRAG_END', function (event, channel) {
      console.log('drag ended on dancecard....');
      //listen for "remove-person" channel
      //onoly do stuff with that channel
      if(channel == 'remove-person'){
        $scope.$apply(function(){
            $scope.showRemove = false;
          });
      }
    });


    $scope.onDropRemove = function(event, data) {
      console.log('dropping to remove user from dancecard...');
      console.log(event);
      console.log(data);
      $scope.showRemove = false;
      removeFromDancecard(data);
    };

    function removeFromDancecard(user){

      if(user.userid != -1){
        if(Profile.selectedProfile.userid == user.userid){
            UiState.showDetailsPanel = false;
        }
        console.log(Profile.selectedForRemoval);
        Profile.selectedForRemoval = user;
        if(Profile.selectedForRemoval.mutual){
           $state.go('main.removeSurvey');
        }
        else{
            var data = {
              userid: Profile.selfProfile.userid,
              partnerid: user.userid,
              status: 'removed'
            };

            DancecardService.updateDancecard(data, user);
            $state.go('main.profileList');
        }
       }
       else{
        console.log('cannot remove placeholder user...');
       }
    }

  }]);