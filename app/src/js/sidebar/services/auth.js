/*******************************************************************************************************
Login Service  */

angular.module('AuthModule', [])
  .factory('AuthService',
    [
      '$http',
      '$q',

      function ($http, $q) {

        function loginUser(credentials) {
          var D = $q.defer();

          $http({
            method: 'POST',
            url: SERVER + "/login",
            data: credentials
          })
            .success(function(data, status, headers, config){
              D.resolve(data);
            })
            .error(function(data, status, headers, config){
              console.log('error logging in user');
              D.reject();
            });

          return D.promise;
        }

        function logoutUser(userid) {
          var D = $q.defer();

          $http({
              method: 'POST',
              url: SERVER + '/logout',
              data: {userid: userid}
          })
            .success(function(data, status, headers, config){
              D.resolve(data);
            })
            .error(function(data, status, headers, config){
              console.log('error logging out user');
              D.reject();
            });

          return D.promise;
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
          checkUserStatus: checkUserStatus
        };

      }
    ]);