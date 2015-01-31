/*******************************************************************************************************
Profile Service  */
angular.module('appServices2', [])
  .factory('Profile',
    [
      '$rootScope',
      '$http',
      '$q',

      function ($rootScope, $http, $q) {

        var pageProfiles = [];

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
              pageProfiles = data;
              D.resolve(data);
            })
            .error(function(){
              D.resolve([]);
            });
            
          return D.promise;
        }

        function getIndexOfFirstOutsider() {
          for(var i=0; i<pageProfiles; i++){
            if(pageProfiles[i].relevance == 2){
              return i;
            }
          }
          return i;
        }

        function getProfilesByPage(url, limit, userid) {

          var D = $q.defer();
          var queryString = "url=" + url + "&userid=" + userid + "&limit=" + limit;
          
          if (pageProfiles.length > 0) {
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
                D.resolve(pageProfiles);
            })
            .error(function(data, status, headers, config) {
              console.log('get people failure');
              D.reject();
            });

            return D.promise;
        }

        return {
          makeFullImageUrl: makeFullImageUrl,
          getProfilesByPage: getProfilesByPage,
          getStaticProfileList: getStaticProfileList,
          clearPageProfiles: clearPageProfiles,
          removeFromPageProfiles: removeFromPageProfiles,
        };

     }
   ]);