/*******************************************************************************************************
Signup Service  */

appServices.factory('SignupService',
  [
    '$http',

    function ($http) {

      var user = {};
      var pref = {};

      function signupUser(callback){
        console.log('signup user!');
        $http({
          method: 'POST',
          url: SERVER + "/signup",
          data: {
            email: user.email,
            password: user.password,
            user: user,
            pref: pref
          }
        })
          .success(function(data, status, headers, config){
            callback(data);
            user = {};
            pref = {};
          })
          .error(function(data, status, headers, config){
            console.log('error signing up user: sending data to server failed');
          });
      }

      return {
        signupUser : signupUser,
        user: user,
        pref: pref
      };
    }
  ]);