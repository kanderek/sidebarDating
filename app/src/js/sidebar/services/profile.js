/*******************************************************************************************************
Profile Service  */

appServices.factory('Profile',
  [
    '$rootScope',
    '$http',
    '$state',
    '$q',

    function ($rootScope, $http, $state, $q) {

      var pageProfiles = [];
      
      $rootScope.selectedProfile = null;
      var selfProfile = null;
      var selfPref = null;
      var selectedForRemoval = null;
      var previousProfile = null;

      function processImageUrls(imgArray) {
        // console.log('in process images urls....');
        // console.log(imgArray);
        if(imgArray){
          for(var i=0; i<imgArray.length; i++){
            imgArray[i] = SERVER + imgArray[i];
          }
        }
        return imgArray;
      }

      function makeFullImageUrl(data) {
        console.log('making full image urls....before');
        console.log(data);
        for(var i=0; i<data.length; i++){
            data[i].imageurls = processImageUrls(data[i].imageurls);
            data[i].medimageurls = processImageUrls(data[i].medimageurls);
            data[i].smallimageurls = processImageUrls(data[i].smallimageurls);
          }
          console.log('making full image urls....after');
          console.log(data);
          return data;
      }

      function getSelfProfile() {
        return selfProfile;
      }

      function getSelectedProfile() {
        return selectedProfile;
      }

      function initializeProfile(user, pref, url) {
        var D = $q.defer();

        console.log('initilize Profile for user ' + user);

        if (typeof(user) === 'object') {
          console.log('initializing profile data on signup...');
          console.log(user);
          user = makeFullImageUrl([user]);
          selfProfile = user[0];
          selectedProfile = user[0];
          selfPref = pref;
          console.log(selfPref);
          var gender = selfPref.male ? 'm' : '';
          gender += selfPref.female ? 'f' : '';
          getStaticProfileList(gender);

          $rootScope.$broadcast('profile-selected');
          $rootScope.$broadcast('user-data-available');

          D.resolve(selfProfile);
        }
        else {
          getProfileById(user)
            .then(function(profile){
              console.log('iniitializing profile data on login...');
              console.log(profile);
              selfProfile = _.clone(profile);
              selectedProfile = _.clone(profile);

              console.log('initializeProfile: selfProfile after assignment');
              console.log(selfProfile);
              getProfilesByPage(url, 10);

              $rootScope.$broadcast('profile-selected');
              $rootScope.$broadcast('user-data-available');

              D.resolve(selfProfile);
            });
        }

        return D.promise;
      }

      function findIndexForPageProfileById(userid) {
        for(var i=0; i < pageProfiles.length; i++){
          if(pageProfiles[i].userid == userid){
            return i;
          }
        }
        return -1;
      }

      function selectProfile(user, from) {
        if(user.userid !== previousProfile.userid){
          if(from != 'list'){
            $('#select-indicator').css({'opacity': 0, 'top': '-15px'});
          }
          else{
            var i = findIndexForPageProfileById(user.userid);
            $('#select-indicator').css('top', function(){
              return 18 + 62*i + 'px';
            });
            $('#select-indicator').css('opacity', '1.0');
          }
          selectedProfile = user;
          previousProfile.userid = user.userid;
          $rootScope.$broadcast('profile-selected');
          return false;
        }
        previousProfile.userid = -1;
        return true;
      }

      function removeFromPageProfiles(userid) {
        for(var i=0; i<pageProfiles.length; i++){
          if(pageProfiles[i].userid === userid){
            pageProfiles.splice(i, 1);
            break;
          }
        }
      }

      function clearPageProfiles() {
        pageProfiles = [];
      }

      function getStaticProfileList(gender, callback) {
        $http({
          method: 'GET',
          url: "staticData/profiles_" + gender + ".json"
        })
          .success(function(data, status, headers, config){
            for(var i=0; i<data.length; i++){
              data[i].smallimageurls[0] = SERVER + data[i].smallimageurls[0];
            }
            pageProfiles = data;
            $rootScope.$broadcast('page-profiles-available');
            // callback(data);
          })
          .error(function(data, status, headers, config){
            console.log('error getting static json file');
          });
      }

      function getIndexOfFirstOutsider() {
        for(var i=0; i<pageProfiles; i++){
          if(pageProfiles[i].relevance == 2){
            return i;
          }
        }
        return i;
      }

      function getProfileById(userid) {

        var profileDefer = $q.defer();

        $http({
          method: 'GET',
          url: SERVER + '/profile/'+userid
        })
        .success(function(data, status, headers, config){
          data = makeFullImageUrl(data);
          profileDefer.resolve(data[0]);
        })
        .error(function(data, status, headers, config){
          console.log('error getting user profile ' + userid);
          profileDefer.reject();
        });

        return profileDefer.promise;
      }

      function getProfilesByPage(url, limit) {
        console.log('getting profiles by page...');
        console.log(url_info);
        
        var userid = selfProfile.userid;
        var queryString = "url=" + url_info.url + "&userid=" + userid + "&limit=" + limit;
        
        if(pageProfiles.length > 0){
           queryString += "&pageprofiles=";
           for (var i=0; i<pageProfiles.length; i++) {
               queryString += pageProfiles[i].userid;
               if(i != pageProfiles.length -1){
                  queryString += ',';
               }
           }
        }

        $http({
          method: 'GET',
          url: SERVER + '/crowd/?' + queryString
        })
          .success(function(data, status, headers, config) {

              data = makeFullImageUrl(data);
   
              if(limit === 1 && data.length === 1){
                var index = getIndexOfFirstOutsider();
                pageProfiles.splice(index, 0, data[0]);
              }
              else{
                pageProfiles = data;
              }
              
              console.log(pageProfiles);
              $rootScope.$broadcast('page-profiles-available');

          })
          .error(function(data, status, headers, config) {
            console.log('get people failure');
          });
      }

      return {
        initializeProfile: initializeProfile,
        makeFullImageUrl: makeFullImageUrl,
        getProfileById: getProfileById,
        getProfilesByPage: getProfilesByPage,
        getIndexOfFirstOutsider: getIndexOfFirstOutsider,
        // getStaticProfileList: getStaticProfileList,
        clearPageProfiles: clearPageProfiles,
        removeFromPageProfiles: removeFromPageProfiles,
        selectProfile: selectProfile,
        findIndexForPageProfileById: findIndexForPageProfileById,
        getSelfProfile: getSelfProfile,
        // getSelectedProfile: getSelectedProfile,

        pageProfiles: pageProfiles,
        // selectedProfile: selectedProfile,
        selfProfile: selfProfile,
        selfPref: selfPref,
        selectedForRemoval: selectedForRemoval,
        previousProfile: previousProfile
      };

   }
 ]);