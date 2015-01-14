/*******************************************************************************************************
Profile List Controller  */

appControllers.controller('ProfileListCtrl', ['$scope', '$rootScope', '$timeout', '$state','Profile', 'UiState',
  function($scope, $rootScope, $timeout, $state, Profile, UiState) {

    $scope.profiles = Profile.pageProfiles;

    $scope.$on('page-profiles-available', function(event){
      // $state.go('main.profileList');
      $scope.profiles = Profile.pageProfiles;
    });

    $scope.ifSelected = function(i){
      return (UiState.showDetailsPanel && Profile.selectedProfile.userid == $scope.profiles[i].userid);
    };

    $scope.selectOnly = function(i){
      UiState.selectProfile($scope.profiles[i], 'list');// ? UiState.closeDetailsPanel() : 
      // UiState.openDetailsPanel();
    };

  }]);
