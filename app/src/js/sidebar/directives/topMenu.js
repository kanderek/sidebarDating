angular.module('topMenuDirective', ['AuthModule'])
    .directive('topMenu', ['$interval', '$rootScope', '$location', function ($interval, $rootScope, $location) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/topMenu.html',
            scope: {
                user: '=',
                notificationUrl: '@',
                settingsUrl: '@'
            },
            controller: 'topMenuController',
            controllerAs: 'tmc',
            link: link
        };
    }])
    .controller('topMenuController',
      [
        '$rootScope',
        '$scope',
        '$location',
        'AuthService',

        function ($rootScope, $scope, $location, AuthService) {

          $scope.isSignedIn = function () {
            return true;
          };

          $scope.logout = function () {
            console.log('....trying to logout user...');
            AuthService.logoutUser($scope.user.userid)
              .then(function () {
                  console.log('...user logged out successful');
                  $rootScope.$broadcast('user-logged-out');
                  $location.url($scope.settingsUrl);
              });
          };

          $scope.goToNotificationView = function () {
              $location.url($scope.notificationUrl);
          };

          $scope.back = function () {
              console.log('going back...?');
              $rootScope.back();
          };
        
      }]);