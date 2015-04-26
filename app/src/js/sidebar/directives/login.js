angular.module('LoginDirective', ['AuthModule'])
    .directive('sidebarLogin', ['$interval', function ($interval) {

        function link(scope, element, attrs) {
          console.log(scope);
          console.log(scope.homeUrl);
          console.log(scope.signupUrl);
        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/login.html',
            scope: {
                homeUrl: '@',
                signupUrl: '@'
            },
            link: link,
            controller: 'loginController',
            controllerAs: 'lc'
        };
    }])
    .controller('loginController',
      [
        '$rootScope',
        '$scope',
        '$timeout',
        'AuthService',
        '$location',

        function ($rootScope, $scope, $timeout, AuthService, $location) {

          var _this = this;

          this.credentials = {
            email: '',
            password: ''
          };

          this.loggedIn = false;

          $scope.login = function () {

              AuthService.loginUser(_this.credentials)
                  .then(function(userData){
                    console.log('logged in!');
                    this.loggedIn = true;
                    clearCredentials();
                    userData.selected_user = {};
                    $rootScope.$broadcast('user-logged-in', userData);
                    $location.url($scope.homeUrl);
                  },
                  function () {
                    this.loggedIn = false;
                    clearCredentials();
                  });
          };

          $scope.signup = function () {
              $location.url($scope.$parent.urls.signupUrl);
          };

          function clearCredentials() {
              _this.credentials.email = '';
              _this.credentials.password = '';
          }
        
      }]);


