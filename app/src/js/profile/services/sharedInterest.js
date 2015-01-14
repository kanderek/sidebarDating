appServices.factory('SharedInterestService', ['$http', '$rootScope', 'Profile',
  function($http, $rootScope, Profile){

    sharedInterestService = {};

    sharedInterestService.sharedInterests = function (userid, callback){
      sharedInterestService.getSharedInterestUrls(userid, function(data){
        $rootScope.$broadcast('shared-interest-available');
        callback(data);
      });
    };

    sharedInterestService.getSharedInterestUrls = function(userid1, userid2){

       return $http({
          method: 'GET',
          url: SERVER + '/shared-interest/' + userid1 + '/' + userid2
        }).
        success(function(data, status, headers, config) {
            // console.log('shared-interest success!');
            // console.log(data);
            // callback(data);
        }).
        error(function(data, status, headers, config) {
          console.log('get shared interest failed');
        });
    };

    return sharedInterestService;

  }]);