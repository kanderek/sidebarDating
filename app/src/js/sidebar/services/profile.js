/*******************************************************************************************************
Profile Service  */
angular.module('appServices2', [])
  .factory('Profile',
    [
      '$rootScope',
      '$http',
      '$q',

      function ($rootScope, $http, $q) {

        var peopleForUrl = {
                url: "",
                primary: [],
                fringes: []
            };

        var profilesRequestCount = 0;

        function processImageUrls(imgArray) {

            if(imgArray){
              for(var i=0; i<imgArray.length; i++){
                imgArray[i] = SERVER + imgArray[i];
              }
            }
            return imgArray;
        }

        function makeFullImageUrl(data) {

            for (var i=0; i<data.length; i++) {
                data[i].imageurls = processImageUrls(data[i].imageurls);
                data[i].medimageurls = processImageUrls(data[i].medimageurls);
                data[i].smallimageurls = processImageUrls(data[i].smallimageurls);
            }
            return data;
        }

        function clearPageProfiles() {
            peopleForUrl = {
                url: "",
                primary: [],
                fringes: []
            };

            profilesRequestCount = 0;
        }

        function getStaticProfileList(gender) {

            var D = $q.defer();

            $http({
              method: 'GET',
              url: "staticData/profiles_" + gender + ".json"
            })
              .success(function(data, status, headers, config){
                for(var i=0; i<data.length; i++){
                  data[i].image_url = SERVER + data[i].image_url;
                }
                primaryPageProfiles = data;
                D.resolve(data);
              })
              .error(function(){
                D.resolve([]);
              });
              
            return D.promise;
        }

        function buildQueryString(url, limit, userid) {
            var queryString = "url=" + url + "&userid=" + userid + "&limit=" + limit;
            var excludeProfiles = peopleForUrl.primary.concat(peopleForUrl.fringes);

            if (excludeProfiles.length > 0 && exclude) {
               queryString += "&pageprofiles=";
               for (var i=0; i < excludeProfiles.length; i++) {
                   queryString += excludeProfiles[i].userid;
                   if(i != excludeProfiles.length -1){
                      queryString += ',';
                   }
               }
            }
            return queryString;
        }

        function removeUserFromPage(userid) {
            var i=0;

            for (i=0; i < peopleForUrl.primary.length; i++) {
              if (peopleForUrl.primary[i].userid === userid) {
                peopleForUrl.primary.splice(i, 1);
                return true;
              }
            }

            for (i=0; i < peopleForUrl.fringes.length; i++) {
              if (peopleForUrl.fringes[i].userid === userid) {
                peopleForUrl.fringes.splice(i, 1);
                return true;
              }
            }

            return false;
        }

        function getNewUserForPage(userid) {
            return getProfilesByPage(peopleForUrl.url, 1, userid);
        }

        function getProfilesByPage(url, limit, userid) {

            var D = $q.defer();
            var queryString = buildQueryString(url, limit, userid);

            $http({
              method: 'GET',
              url: SERVER + '/crowd/?' + queryString
            })
              .success(function (data, status, headers, config) {

                  data.primary = makeFullImageUrl(data.primary);
                  data.fringes = makeFullImageUrl(data.fringes);
       
                  if (url === peopleForUrl.url) {
                      peopleForUrl.primary.concat(data.primary);
                      peopleForUrl.fringes.concat(data.fringes);
                  } else {
                      peopleForUrl = data;
                  }

                  D.resolve(peopleForUrl);
              })
              .error(function(data, status, headers, config) {
                console.log('get people failure');
                D.reject();
              });

            return D.promise;
        }

        function getProfiles(url, limit, userid) {
            var D = $q.defer();

            if (profilesRequestCount === 0) {
                getProfilesByPage(url, limit, userid)
                  .then(function (pageProfiles) {
                      D.resolve(pageProfiles);
                  }, function () {
                      D.reject();
                  });
            } else {
                D.resolve(peopleForUrl);
            }
            profilesRequestCount += 1;

            return D.promise;
        }

        return {
            makeFullImageUrl:     makeFullImageUrl,
            getProfilesByPage:    getProfilesByPage,
            getNewUserForPage:    getNewUserForPage,
            getProfiles:          getProfiles,
            getStaticProfileList: getStaticProfileList,
            clearPageProfiles:    clearPageProfiles,
            removeUserFromPage:   removeUserFromPage,
        };

     }]);