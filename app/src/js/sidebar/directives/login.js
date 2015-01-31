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
            // transclude: true,
            scope: {
                homeUrl: '@',
                signupUrl: '@'
            },
            link: link,
            controller: 'loginController',
            controllerAs: 'lc'
        };
    }])
    .controller('loginController', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {

        var _this = this;

        this.credentials = {
          email: '',
          password: ''
        };

        this.loggedIn = false;

        $scope.login = function () {

          console.log('Email entered: ' + _this.credentials.email);
          console.log('Password entered: ' + _this.credentials.password);
            AuthService.loginUser(_this.credentials)
                .then(function(data){
                  console.log('logged in!');
                  console.log(data);
                  clearCredentials();
                  $location.url($scope.homeUrl);
                },
                function () {
                  clearCredentials();
                });
       };

       $scope.signup = function () {
        console.log('signup called');
        console.log($scope.signupUrl);
        console.log($scope);
          $location.url($scope.$parent.urls.signupUrl);
       };

       function clearCredentials() {
          _this.credentials.email = '';
          _this.credentials.password = '';
       }
      
    }]);


