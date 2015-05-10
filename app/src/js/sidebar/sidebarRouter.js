var sidebarRouter = [
  '$routeProvider',
  '$locationProvider',
  
  function ($routeProvider, $locationProvider) {
    
    $routeProvider
      .when('/testing/home', {
        templateUrl: 'partials/new/homeView.html'
      })
      .when('/testing/signup', {
        templateUrl: 'partials/new/signup0.html',
        controller: 'SignupController'

      })
      .when('/testing/signup/:step', {
        templateUrl: function (params) {
            console.log('in signup route template function....');
            console.log(params);
            return 'partials/new/signup' + params.step + '.html';
            // return 'partials/new/signupView.html'
        },
        controller: 'SignupController'
      })
      .when('/testing/login', {
        templateUrl: 'partials/new/loginView.html'
      })
      .when('/testing/settings', {
        templateUrl: 'partials/new/loginView.html'
      })
          .when('/testing/message/', {
        templateUrl: 'partials/new/messageView.html'
      })
      .when('/testing/notification', {
        templateUrl: 'partials/new/notificationView.html'
      })
      .when('/testing/survey', {
        templateUrl: 'partials/new/surveyView.html'
      });

      $locationProvider.html5Mode(false).hashPrefix('!');

}];