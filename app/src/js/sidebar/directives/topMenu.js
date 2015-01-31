angular.module('topMenuDirective', ['AuthModule'])
    .directive('topMenu', ['$interval', '$rootScope', '$location', function ($interval, $rootScope, $location) {

        function link(scope, element, attrs) {
          console.log(scope.username);
          console.log(scope.notificationCount);

          element.on('click', function (event) {
            var targetId = event.target.id;

            console.log(targetId);

            switch (targetId) {
              case 'back-button':
                scope.$apply(function () {
                  $rootScope.back();
                });
                break;
              case 'go-to-notifications':
                scope.$apply(function () {
                  console.log(scope);
                  $location.url(scope.notificationUrl);
                });
                break;
              default:
                console.log('what happend?');
            }
          });

          scope.$on('$destroy', function () {
            element.off('click');
          });
        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/topMenu.html',
            scope: {
                notificationCount: '@',
                username: '@',
                notificationUrl: '@',
                settingsUrl: '@'
            },
            link: link
            // transclude: true
        };
    }])
    .controller('topMenuController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {

      $scope.isSignedIn = function () {
        return true;
      };
      
    }]);