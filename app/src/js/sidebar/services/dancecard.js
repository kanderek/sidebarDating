/*******************************************************************************************************
Dancecard Service  */

angular.module('appServices', ['appServices2'])
  .factory('DancecardService',
    [
      '$q',
      '$http',
      'Profile',

      function ($q, $http, Profile) {

        var dancecard = [];
        var interestedPeople = [];
        var stagedForRemoval = null;


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
              .success(function (data, status, headers, config) {
                interestedPeople  = data;
              });
        }

        function getDancecardById(userid) {
          var D = $q.defer();

          if (!userid) {
              dancecard = [];
              D.resolve([]);
          } else if (dancecard.length !== 0) {
              D.resolve(dancecard);
          } else {

            $http({
              method: 'GET',
              url: SERVER + "/dancecard/"+userid
            })
              .success(function (data, status, headers, config) {
                data = Profile.makeFullImageUrl(data);
                data.map(function(member) {
                  member.image_url = SERVER + member.image_url;
                  return member;
                });
                dancecard = data;
                D.resolve(data);
              });
          }

          return D.promise;
        }

        function addToDancecard(selfid, userid) {
          return $http({
              method: 'POST',
              url: SERVER + "/dancecard",
              data: {
                status: 'added',
                userid: selfid,
                partnerid: userid
              }
            })
              .then(function (returnedDancecard) {
                dancecard = Profile.makeFullImageUrl(returnedDancecard.data);
                dancecard.map(function(member) {
                  member.image_url = SERVER + member.image_url;
                  return member;
                });
                return dancecard;
              });
        }

        function removeFromDancecard(selfid, userid) {
          return $http({
              method: 'PUT',
              url: SERVER + "/dancecard",
              data: {
                status: 'removed',
                userid: selfid,
                partnerid: userid
              }
            })
              .then(function (returnedDancecard) {
                  stageForRemoval = null;
                  dancecard = Profile.makeFullImageUrl(returnedDancecard.data);
                  dancecard.map(function(member) {
                  member.image_url = SERVER + member.image_url;
                    return member;
                  });
                  return dancecard;
              });
        }

        function postDancecardUpdate(postData) {

          return $http({
              method: 'POST',
              url: SERVER + "/dancecard",
              data: postData
            });
        }

        function stageForRemoval(user) {
          stagedForRemoval = user;
        }

        function getStagedUser() {
          return stagedForRemoval;
        }

        return {
          getStaticDancecard:      getStaticDancecard,
          getInterestedPeopleById: getInterestedPeopleById,
          getDancecardById:        getDancecardById,
          postDancecardUpdate:     postDancecardUpdate,
          stageForRemoval:         stageForRemoval,
          getStagedUser:           getStagedUser,
          addToDancecard:          addToDancecard,
          removeFromDancecard:     removeFromDancecard
        };
    }]);