/*******************************************************************************************************
Interest Service  */

appServices.factory('InterestService', ['$http', '$rootScope',
  function($http, $rootScope){

    interestService = {};

    interestService.userInterests = {};

    interestService.usersTreemap = function (userid, callback){
      if(interestService.userInterests[userid]){
        // console.log(interestService.userInterests[userid]);
        $rootScope.$broadcast('treemap-data-available');
        callback(interestService.userInterests[userid]);
      }
      else{
        // console.log('in users Treemap...');
        // console.log(userid);
        interestService.getInterestTreemapByUserid(userid, function(data){
          // console.log(data);
           $rootScope.$broadcast('treemap-data-available');
          callback(data);
        });
      }
    };

    interestService.getInterestTreemapByUserid = function(userid, callback){

       $http({
          method: 'GET',
          url: SERVER + '/interest/' + userid
        }).
        success(function(data, status, headers, config) {
          // if(data.status != "logged_out"){
             //callback(data);   // this callback will be called asynchronously when the response is available
            // console.log(data);
            interestService.userInterests[userid] = data;
            callback(data);
            // $rootScope.$broadcast('page-profiles-available');
          // }
          // else{
          //   $state.go('sign-up-0');
          // }
        }).
        error(function(data, status, headers, config) {
          console.log('get people failure');
        });
    };

      interestService.getInterestTreemapByUseridPromise = function(userid){

       return $http({
          method: 'GET',
          url: SERVER + '/interest/' + userid
        }).
        success(function(data, status, headers, config) {
          // if(data.status != "logged_out"){
             //callback(data);   // this callback will be called asynchronously when the response is available
            // console.log(data);
            interestService.userInterests[userid] = data;
            // callback(data);
            // $rootScope.$broadcast('page-profiles-available');
          // }
          // else{
          //   $state.go('sign-up-0');
          // }
        }).
        error(function(data, status, headers, config) {
          console.log('get people failure');
        });
    };

    return interestService;

  }]);