/*******************************************************************************************************
History Test Controller  */

appControllers.controller('HistoryTestCtrl', ['$scope', '$upload', '$rootScope', '$state', 'HistoryService',
    function($scope, $upload, $rootScope, $state, HistoryService) {
      $scope.history = null;
      $scope.time_ago = null;
      $scope.output = null;

      $scope.getHistory = function(){
        HistoryService.getHistory(function(response){
            $scope.$apply(function(){
              $scope.history = response;
            });
            HistoryService.saveHistory(response, function(data){
              console.log('returned from saveHistory...');
              console.log(data);
            });
        });
      };

  }]);