angular.module('InfoPanelDirective', ['IframeModule'])
    .directive('infoPanel', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/infoPanel.html',
            scope: {
              userData: '=',
            },
            link: link,
            controller: 'InfoPanelController',
            controllerAs: 'ipc'
        };
    }])
    .controller('InfoPanelController', ['$scope', 'Iframe', function($scope, Iframe) {

      var _this = this;
      
      this.dancecardMax = 5;

      $scope.addToDancecard = function () {
        console.log('profile trying to add user to dancecard');
        Iframe.addToDancecard($scope.userData.userid);
      };

      $scope.removeFromDancecard = function () {
        console.log('profile trying to remove user from dancecard');
        Iframe.removeFromeDancecard($scope.userData.userid);
      };

      $scope.openMessages = function () {
        console.log('profile opening message view in sidebar');
        Iframe.openMessages($scope.userData.userid);
      };
      
    }])
    .directive('dancecardIndicator', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/dancecardIndicator.html',
            scope: {
              username: '@',
              dancecardSpots: '@',
              dancecardMax: '@'
            },
            link: link,
            controller: 'DancecardIndicatorController',
            controllerAs: 'dic'
        };
    }])
    .controller('DancecardIndicatorController', ['$scope', function($scope) {

      var _this = this;

      this.dancecard = [];

      $scope.$watch(function ($scope) {
        return $scope.dancecardSpots;
      }, change, true);

      function initialize() {
        for (var i=0; i < $scope.dancecardMax; i++) {
          _this.dancecard.push({fill: i < $scope.dancecardSpots});
        }
      }

      function change() {
        for (var i=0; i < $scope.dancecardMax; i++) {
          _this.dancecard[i] = {fill: i < $scope.dancecardSpots};
        }
      }

      initialize();
      
    }]);
