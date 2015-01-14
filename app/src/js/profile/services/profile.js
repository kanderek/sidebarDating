/*******************************************************************************************************
Profile Service  */

appServices.factory('Profile', ['$rootScope', '$http', '$q',
  function($rootScope, $http, $q){

    var viewedProfiles = {};

    function processImageUrls(imgArray){
      // console.log('in process images urls....');
      // console.log(imgArray);
      if(imgArray){
        for(var i=0; i<imgArray.length; i++){
          imgArray[i] = SERVER + imgArray[i];
        }
      }
      return imgArray;
    }

    function makeFullImageUrl(profileData){

        profileData.imageurls = processImageUrls(profileData.imageurls);
        profileData.medimageurls = processImageUrls(profileData.medimageurls);
        profileData.smallimageurls = processImageUrls(profileData.smallimageurls);

        return profileData;
    }

    function getProfileById(userid){
       var profileDeferred = $q.defer();

      if (viewedProfiles[userid]) {
        profileDeferred.resolve(viewedProfiles[userid]);
      } else {
        $http({
          method: 'GET',
          url: SERVER + '/profile/' + userid
        })
        .success(function (data) {
          viewedProfiles[userid] = makeFullImageUrl(data[0]);
          console.log(viewedProfiles[userid]);
          profileDeferred.resolve(viewedProfiles[userid]);
        });
        // .failure(profileDeferred.reject);
      }

      return profileDeferred.promise;
    }

    return {
      getProfileById: getProfileById
    };

  }]);