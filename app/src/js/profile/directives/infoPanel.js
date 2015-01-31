angular.module('InfoPanelDirective', [])
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
    .controller('InfoPanelController', ['$scope', function($scope) {

      var _this = this;
      
      this.dancecardMax = 5;
      
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

      function initialize() {
        for (var i=0; i < $scope.dancecardMax; i++) {
          _this.dancecard.push({fill: i < $scope.dancecardSpots});
        }
        console.log(_this.dancecard);
      }

      initialize();
      
    }]);
