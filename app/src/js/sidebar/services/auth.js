/*******************************************************************************************************
Login Service  */

appServices.factory('AuthService',
  [
    '$http',
    '$q',
    '$state',
    '$timeout',
    'Profile',
    'UiState',

    function ($http, $q, $state, $timeout, Profile, UiState) {

      var isLoggedIn = false;

      function isUserLoggedIn() {
        return isLoggedIn;
      }

      function loginUser(credentials) {

        var loginDeferred = $q.defer();

          $http({
            method: 'POST',
            url: SERVER + "/login",
            data: credentials
          }).
          success(function(data, status, headers, config){
            isLoggedIn = true;
            loginDeferred.resolve(data);

          }).
          error(function(data, status, headers, config){
            isLoggedIn = false;
            console.log('error logging in user');
            loginDeferred.reject();
          });

          return loginDeferred.promise;
      }

      function logoutUser() {

          $http({
              method: 'GET',
              url: SERVER + '/logout'
            }).
            success(function(data, status, headers, config){
              // callback(data);
              isLoggedIn = false;
              if(UiState.showDetailsPanel){
                // UiState.closeDetailsPanel();
                $timeout(function(){
                   Profile.selfProfile = {};
                   $state.go('login');
                }, 1000);
              }
              else{
                Profile.selfProfile = {};
                $state.go('login');
              }

            }).
            error(function(data, status, headers, config){
              console.log('error logging out user');
            });
      }

      function checkUserStatus(callback) {
        $http({
          method: 'GET',
          url: SERVER + "/authentication_status"
        }).
        success(function(data, status, headers, config){
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log('error logging in user');
        });
      }

      return {
        loginUser: loginUser,
        logoutUser: logoutUser,
        isUserLoggedIn: isUserLoggedIn,
        checkUserStatus: checkUserStatus
      };

    }
  ]);