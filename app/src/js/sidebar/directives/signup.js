angular.module('SignupDirective',
  [
    // 'ngTouch',
    'vr.directives.slider'
  ])
    .controller('SignupController',
      [
        '$scope',
        '$location',
        '$routeParams',
        'SignupService',

        function ($scope, $location, $routeParams, SignupService) {
        
          $scope.baseUrl = '/testing/signup';
          $scope.loginUrl = '/testing/login';
          $scope.home = '/testing/home';

          $scope.signupData = {
          };

          $scope.gender_options = ['M', 'F'];

          $scope.distance_ceil = 100;
          $scope.distance_floor = 1;

          $scope.age_floor = 18;
          $scope.age_ceil = 99;

          function enumerate(start, end) {
            var x = [];

            for (var i=start; i <= end; i++) {
              x.push(i);
            }

            return x;
          }

          function setupMonthOptions() {
            return enumerate(1, 12);
          }

          function isLeapYear(year) {
            var lastHundredLeapYear = 1600;
            // A leap year is every 4 years, but not every 100 years, then again every 400 years.
            return year % 4 === 0 && (year - 1600) % 400 === 0;
          }

          function isOddMonth(month) {
            return month % 2;
          }

          function isFebruary(month) {
            return month === 2;
          }

          function setupDayOptions(month, year) {
            var endDay = 30;

            if (isFebruary(month)) {
              if (isLeapYear(year)) {
                endDay = 29;
              } else {
                endDay = 28;
              }
            } else if(isOddMonth(month)) {
              endDay = 31;
            }

            return enumerate(1, endDay);
          }

          function setupYearOptions(minAge, maxAge) {
            var currentYear = moment().year();

            return enumerate(currentYear - maxAge, currentYear - minAge).reverse();
          }

          function initialize() {
            $scope.month_options = setupMonthOptions();
            $scope.day_options = setupDayOptions(2, 2000);
            $scope.year_options = setupYearOptions(18, 58);
            $scope.signupData = SignupService.getSignupData();
          }

          $scope.updateDayMax = function () {
            $scope.day_options = setupDayOptions($scope.signupData.dob_month, $scope.signupData.dob_year);
          };

          $scope.back = function () {
            console.log($routeParams);
            var step = $routeParams.step;
            var previousStep = parseInt(step, 10) - 1;

            if (previousStep && previousStep > 0) {
              $location.url($scope.baseUrl + '/' + previousStep);
            } else {
              SignupService.clear();
              $location.url($scope.baseUrl);
            }
          };

          $scope.next = function () {
              console.log($routeParams);
              var step = $routeParams.step || 0;
              var nextStep = parseInt(step, 10) + 1;

              $location.url($scope.baseUrl + '/' + nextStep);
              if (!_.isEmpty($scope.signupData)) {
                SignupService.updateSignupData($scope.signupData);
              }
          };

          $scope.finish = function () {
              SignupService.updateSignupData($scope.signupData);
              $location.url($scope.home);
          };

          $scope.goToLogin = function () {
              $location.url($scope.loginUrl);
          };

          initialize();

    }])
  .factory('SignupService', ['$q', '$http', function ($q, $http) {
      var signupData = {
          pref: {
              male: false,
              female: false,
              age_min: 30,
              age_max: 40,
              distance_max: 13
            }
      };

      function clear() {
          signupData = {};
      }

      function updateSignupData(data) {
          signupData = _.extend(signupData, data);
      }

      function getSignupData(data) {
          return signupData;
      }

      function signupUser() {
          var D = $q.defer();

          $http({
            method: 'POST',
            url: SERVER + "/signup",
            data: {
              email: signupData.email,
              password: signupData.password,
              signupData: signupData
            }
          })
            .success(function(data, status, headers, config){
                D.resolve(data);
            })
            .error(function(data, status, headers, config){
                console.log('error signing up user: sending data to server failed');
                D.reject();
            });
      
          return D.promise;
      }

      return {
          signupUser : signupUser,
          getSignupData: getSignupData,
          updateSignupData: updateSignupData,
          clear: clear
      };

    }]);
