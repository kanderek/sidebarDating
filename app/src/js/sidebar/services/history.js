/*******************************************************************************************************
History Service  */

appServices.factory('HistoryService',
  [
    '$http',
    'Profile',

    function($http, Profile){

      var currentUrl = null;

      function getHistory(callback){
          var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
          var oneWeekAgo = (new Date()).getTime() - microsecondsPerWeek;
          var limit = 30;

          chrome.runtime.sendMessage({type: 'history', time_ago: oneWeekAgo, limit: limit}, function(response) {
              console.log('response from background script...');
              console.log(response);
              // $scope.output = response;
              callback(response);
            });
        }

      function saveHistory(data, callback){
        $http({
          method: 'POST',
          url: SERVER + "/history",
          data: {userid: Profile.selfProfile.userid, history: data}
        }).
        success(function(data, status, headers, config){
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log('error saving history data...');
        });
      }

      return {
        getHistory: getHistory,
        saveHistory: saveHistory
      };
    }
  ]);