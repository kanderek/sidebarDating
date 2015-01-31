/*******************************************************************************************************
Dancecard Service  */

angular.module('appServices', ['appServices2'])
  .factory('DancecardService',
    [
      '$q',
      '$http',
      'Profile',

      function (
        $q,
        $http,
        Profile
      ) {

        var dancecard = [];
        var interestedPeople = [];


        function getStaticDancecard() {
          var D = $q.defer();

          $http({
            method: 'GET',
            url: "staticData/dancecard.json"
          })
            .success(function (response) {
              D.resolve(response);
            })
            .error(function () {
              D.resolve([]);
            });

          return D.promise;
        }

        function getInterestedPeopleById(userid) {

          return $http({
              method: 'GET',
              url: SERVER + "/dancecard/interested/"+userid
            })
              .success(function(data, status, headers, config){
                interestedPeople  = data;
              });
        }

        function getDancecardById(userid) {
          var D = $q.defer();

          $http({
              method: 'GET',
              url: SERVER + "/dancecard/"+userid
            })
              .success(function(data, status, headers, config) {
               D.resolve(data);
              });

          return D.promise;
        }

        function postDancecardUpdate(postData) {

          return $http({
              method: 'POST',
              url: SERVER + "/dancecard",
              data: postData
            });
        }

        return {
          getStaticDancecard:      getStaticDancecard,
          getInterestedPeopleById: getInterestedPeopleById,
          getDancecardById:        getDancecardById,
          postDancecardUpdate:     postDancecardUpdate
        };
    }]);