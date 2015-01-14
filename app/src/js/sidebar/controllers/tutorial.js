/*******************************************************************************************************
Tutorial Controller  */

appControllers.controller('TutorialCtrl', ['$scope', '$state', 'Profile',
  function($scope, $state, Profile) {


    $scope.firstVisit = false;
    $scope.step1 = true;
    $scope.step2 = false;
     $scope.step3 = false;

    $scope.$on('start-tutorial', function(event){
      $scope.firstVisit = true;
      $scope.step1 = true;
      $scope.step2 = false;
      $scope.step3 = false;
    });



    $scope.next = function(){
      if($scope.step1){
        $scope.step1 = false;
        $scope.step2 = true;
      }
      else if($scope.step2){
        $scope.step2 = false;
        $scope.step3 = true;
      }
      else if($scope.step3){
        $scope.step3 = false;
        $scope.firstVisit = false;
        //load real data for page...
        Profile.clearPageProfiles();
        Profile.getProfilesByPage("", 10);
      }
    };

  }]);