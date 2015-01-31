/*******************************************************************************************************
Interest Service  */

angular.module('InterestModule', []).factory('InterestService', ['$q', '$http',
  function($q, $http){

    var userInterests = {};

    function getInterestTreemapByUserid(userid){
      var D = $q.defer();

      if (userInterests[userid]) {
        D.resolve(userInterests[userid]);
      } else {

         $http({
            method: 'GET',
            url: SERVER + '/interest/' + userid
          })
            .success(function(data, status, headers, config) {
                userInterests[userid] = data;
                D.resolve(data);
            })
            .error(function(data, status, headers, config) {
              console.log('failure getting user treemap');
              D.reject();
            });
      }
      
      return D.promise;
    }

    return {
      getInterestTreemapByUserid: getInterestTreemapByUserid
    };

  }]);