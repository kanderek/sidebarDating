/***************************************************************************
/
/ Angular Code, app config, services/factories (models),  and controllers
/
/***************************************************************************/


/* Angular-specific code goes here (i.e. defining and configuring
 * modules, directives, services, filters, etc.) */

var SIDEBAR_ANIMATION = 1000;
var DETAILS_ANIMATION = 1000;
var SELECT_ANIMATION = 500;

var sidebarApp = angular.module('sidebarApp',[
  'ngRoute',
  'vr.directives.slider',
  'angular-carousel',
  'ngDragDrop',
  'angularFileUpload',
  'ui.router',
  'appControllers',
  'appServices'
]);


sidebarApp.config([
  '$routeProvider',
  '$sceDelegateProvider',
  '$stateProvider',
  '$sceProvider',
  '$provide',
  
  function(
    $routeProvider,
    $sceDelegateProvider,
    $stateProvider,
    $sceProvider,
    $provide) {

    $routeProvider
      .when('/', {
        templateUrl: 'partials/profileList.html',
        controller: 'ProfileListCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup0.html',
        controller: 'SignupCtrl'
      })
      .when('/signup/step1', {
        templateUrl: 'partials/signup1.html',
        controller: 'SignupCtrl'
      })
      .when('/signup/step2', {
        templateUrl: 'partials/signup2.html',
        controller: 'SignupCtrl'
      })
      .when('/signup/step3', {
        templateUrl: 'partials/signup3.html',
        controller: 'SignupCtrl'
      });

    // $sceProvider.enabled(false);
    // $sceDelegateProvider.resourceUrlWhitelist([
    //   // Allow same origin resource loads.
    //   'self',
    //   // Allow loading from outer templates domain.
    //   'chrome-extension://*/partials/**'
    // ]);

    // $provide.decorator('$state', function($delegate, $stateParams) {
    //     $delegate.forceReload = function() {
    //         return $delegate.go($delegate.current, $stateParams, {
    //             reload: true,
    //             inherit: false,
    //             notify: true
    //         });
    //     };
    //     return $delegate;
    // });

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        // .state('file-upload-teset', {
        //   url: '',
        //   views: {
        //     'sidebar': {
        //       templateUrl: 'partials/fileUploadTest.html'),
        //       controller: 'UploadTestCtrl'
        //     }
        //   }
        // })
        // HOME STATES AND NESTED VIEWS ========================================

        .state('check-status', {
          url: '',
          views: {
            'sidebar': {
              templateUrl: 'partials/checkStatus.html',
              controller: 'CheckStatusCtrl'
            }
          }
        })

        .state('sign-up-0', {
          url: '',
          views: {
            'sidebar': {
                templateUrl: 'partials/signup0.html',
                controller: 'SignupCtrl'
              }
          }
        })

        .state('sign-up-1', {
          url: '',
          views: {
            'sidebar': {
                templateUrl: 'partials/signup1.html',
                controller: 'SignupCtrl'
              }
          }
        })

        .state('sign-up-2', {
          url: '',
          views: {
            'sidebar': {
                templateUrl: 'partials/signup2.html',
                controller: 'SignupCtrl'
              }
          }
        })

        .state('sign-up-3', {
          url: '',
          views: {
            'sidebar': {
                templateUrl: 'partials/signup3.html',
                controller: 'SignupCtrl'
              }
          }
        })

        .state('login', {
          url: '',
          views: {
            'sidebar': {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
              }
          }
        })

        .state('main', {
          views: {
            'sidebar': {
                templateUrl: 'partials/danceCardMenu.html',
                controller: 'DanceCardCtrl'
              }
          }
        })

        .state('main.history-test', {
          url: '',
          templateUrl: 'partials/historyTest.html',
          controller: 'HistoryTestCtrl'
        })

        .state('main.notifications', {
          url: '',
          templateUrl: 'partials/notifications.html',
            controller: 'NotificationCtrl'
            })

        .state('main.profileList', {
          url: '',
          templateUrl: 'partials/profileList.html',
            controller: 'ProfileListCtrl'
            })

        .state('main.messages', {
              url: '',
          templateUrl: 'partials/messages.html',
            controller: 'MessageCtrl'
            })

        .state('main.removeSurvey', {
          url: '',
          templateUrl: 'partials/removeSurvey.html',
            controller: 'RemoveSurveyCtrl'
        });

        console.log("i'm in config for the sidebar app");

  }]);

var appServices = angular.module('appServices', ['ngResource']);
var appControllers = angular.module('appControllers', []);

/********************************************************************************************************
//
//    ssssss    eeeee    rrrrrr    vv     vv   ii    ccccc    eeeee     ssssss
//   ss        ee   ee   rr   rr   vv     vv        ccc      ee   ee   ss
//    sssss    eeeeee    rr         vv   vv    ii   ccc      eeeeee     sssss
//        ss   ee        rr          vv vv     ii   ccc      ee             ss
//   ssssss     eeeeee   rr           vvv      ii    ccccc    eeeeee   ssssss
//
//*******************************************************************************************************
 Services */

/*******************************************************************************************************
Message Service  */

appServices.factory('MessageService',
  [
    '$http',
    '$state',
    '$interval',
    '$rootScope',
    'Profile',

  function ($http, $state, $interval, $rootScope, Profile) {

    var messages = {};
    var chattingWith = null;
    var REFRESH_TIME = 60000; //milliseconds

    function updateRelativeTimestamps(data){
      var sendtime1;
      var sendtime2;

      if(typeof data !== 'undefined' && data.length > 1){
        for(var i=1; i<data.length; i++){
           sendtime1 = moment(data[i-1].sendtime).fromNow() == 'a few seconds ago' ? 'just now' : moment(data[i-1].sendtime).fromNow();
           sendtime2 = moment(data[i].sendtime).fromNow() == 'a few seconds ago' ? 'just now' : moment(data[i].sendtime).fromNow();

            if(sendtime1 != sendtime2){
             data[i].relativeTimestamp = sendtime2;
           }
           else {
             data[i].relativeTimestamp = "";
           }
        }
      }
      
      if(typeof data !== 'undefined' && data[0]){
        data[data.length-1].relativeTimestamp = moment(data[data.length-1].sendtime).fromNow() == 'a few seconds ago' ? 'just now' : moment(data[data.length-1].sendtime).fromNow();
      }

      return data;
    }

    function refreshTimestamps(){
      var userid = $rootScope.selectedProfile.userid;//Profile.getSelectedProfile().userid;

      if(messages[userid]){
        $interval(function () {
          updateRelativeTimestamps(messages[userid]);
          // console.log('refreshing timestamps....');

        }, REFRESH_TIME);
      }
    }

    function getConversationWith(userid) {
      // console.log('getting conversation with.... ' + userid);
      // console.log('RETEIVING:  message service messages!!!');
      // console.log(messageService.messages);
      var conversationWithUser = messages[userid];

      if(conversationWithUser){
        messages[userid] = updateRelativeTimestamps(conversationWithUser);
        refreshTimestamps();

        $rootScope.$broadcast('conversation-available', messages[userid]);
      }
      else{
        getMessageByuserid(userid, function(data){
          console.log('getting messages by userid inside of getConversationWith');
          console.log(data);
          messages[userid] = data;
          refreshTimestamps();

          $rootScope.$broadcast('conversation-available', data);
        });
      }
    }

    function updateConversationWith(userid, message) {
      if(messages[userid]){
        messages[userid].push(message);
      }
      else {
        messages[userid] = [message];
      }

      updateRelativeTimestamps(messages[userid]);

      $rootScope.$broadcast('conversation-available', messages[userid]);
    }

    function sendMessageTo(message) {
        var conversationExists = !!messages[message.receiverid];

        message.relativeTimestamp = 'just now';//moment().fromNow();
        message.sendtime = moment();

        if (conversationExists) {
          messages[message.receiverid].push(message);
        } else {
          messages[message.receiverid] = [message];
        }
        
        updateRelativeTimestamps(messages[message.receiverid]);
        
        sendMessageTouserid(message, function(data){});
    }

    function getStaticMessages(callback) {
      $http({
        method: 'GET',
        url: "staticData/messages.json"
      })
      .success(function(data, status, headers, config){
        callback(data);
      })
      .error(function(data, status, headers, config){
        console.log('error getting static json file');
      });
    }

    function getStaticMessageByuserid(userid, callback) {
      $http({
        method: 'GET',
        url: "staticData/message_user" + userid + ".json"
      }).
      success(function(data, status, headers, config){
        callback(data);
      }).
      error(function(data, status, headers, config){
        console.log('error getting static json file');
      });
    }

    function getMessageByuserid(userid, callback) {
      console.log('getMessageByuserid: ' + SERVER + "/message/" + userid + "/?userId=" + Profile.getSelfProfile().userid);
      $http({
        method: 'GET',
        url: SERVER + "/message/" + userid + "/?userId=" + Profile.getSelfProfile().userid
      })
      .success(function(data, status, headers, config){
          // if(data.status != "logged_out"){
             console.log('getmessagebyuserid...');
             console.log(data);
             if(data){
                data = updateRelativeTimestamps(data);
             }
             else {
                //data received is empty...
             }
             callback(data);
          // }
          // else{
          //   $state.go('sign-up-0');
          // }
      })
      .error(function(data, status, headers, config){
        console.log('error getting messages from server ' + SERVER);
      });
    }

    function sendMessageTouserid(message, callback) {
      if(message.senderid != message.receiverid){
        $http({
          method: 'POST',
          url: SERVER + "/message/",
          data: message
        })
        .success(function(data, status, headers, config){
          // if(data.status != "logged_out"){
             callback(data);
          // }
          // else{
          //   $state.go('sign-up-0');
          // }
        })
        .error(function(data, status, headers, config){
          console.log('error posting message');
        });
      }
      else{
        console.log('Cannot send message to yourself');
      }
    }

  return {
    sendMessageTo: sendMessageTo,
    getConversationWith: getConversationWith
    // sendMessageTouserid: sendMessageTouserid,
    // getMessageByuserid: getMessageByuserid,
    // getStaticMessageByuserid: getStaticMessageByuserid,
    // getStaticMessages: getStaticMessages
  };
}]);

/*******************************************************************************************************
Notification Service  */

appServices.factory('NotificationService', ['$http', '$interval', '$state', 'Profile',
  function($http, $interval, $state, Profile){

      function refreshTimestamps(){
         $interval(function(){
          for(var i=0; i< notificationService.notifications.length; i++){
            notificationService.notifications[i].relativeTimestamp = moment(notificationService.notifications[i].action_time).fromNow();
          }
          // console.log('refreshing timestamps for notifications....');
        }, 60000);
      }

  var notificationService = {};

      notificationService.notifications = [];
      notificationService.unreadCount = 0;

      notificationService.getUnreadCount = function(){

          notificationService.unreadCount = 0;
          for(var i=0; i<notificationService.notifications.length; i++){
            if(notificationService.notifications[i].status == "unread"){
              notificationService.unreadCount += 1;
            }
          }
          return notificationService.unreadCount;
      };

      notificationService.markRead = function(index){
        if(notificationService.notifications[index].status == 'unread'){
          notificationService.unreadCount--;
          notificationService.notifications[index].status = 'read';
          notificationService.updateNotificationStatus({
                notification: {
                  status: notificationService.notifications[index].status,
                  notificationid: notificationService.notifications[index].notificationid
                }
              });
        }
      };

      notificationService.addNotification = function(notification){
          console.log(notification);
          notification.relativeTimestamp = moment(notification.action_time).fromNow();
          notification.smallimage = SERVER + '/' + notification.imgurl;
          notificationService.notifications.unshift(notification);
          notificationService.unreadCount++;
      };

      notificationService.initializeNotifications = function(userid){
        notificationService.getNotifications(userid);
        refreshTimestamps();
      };

      notificationService.getNotifications = function(userid){
        $http({
          method: 'GET',
          url: SERVER + "/notifications/" + userid
        }).
        success(function(data, status, headers, config){
            // if(data.status != "logged_out"){
               // callback(data);

              for(var i=0; i<data.length; i++){
                data[i].relativeTimestamp = moment(data[i].action_time).fromNow();
                data[i].smallimage = SERVER + '/' + data[i].smallimageurls[0];
              }

               console.log(data);
               notificationService.notifications = data;
               notificationService.getUnreadCount();
            // }
            // else{
            //   $state.go('sign-up-0');
            // }
        }).
        error(function(data, status, headers, config){
          console.log('error getting static json file');
        });
      };

      notificationService.updateNotificationStatus = function(data){
          $http({
            method: 'POST',
            url: SERVER + "/notifications/",
            data: data
          }).
          success(function(data, status, headers, config){
               // callback(data);
               //update

          }).
          error(function(data, status, headers, config){
            console.log('error posting message');
          });
        };

  return notificationService;
}]);


/*******************************************************************************************************
Dancecard Service  */

appServices.factory('DancecardService', ['$rootScope', '$http', 'Profile', 'SurveyService',
  function($rootScope, $http, Profile, SurveyService){

  function fillBlankDancecardSpots(){
     var curDancecardLength = dancecardService.dancecard.length;
     for(var i=0; i<(5-curDancecardLength); i++){
       dancecardService.dancecard.push({smallimageurls: [ SERVER + '/user/user.png'], userid: -1});
     }
  }

  function getNumberFreeDancecardSpots(){
      if(dancecardService.dancecard.length === 0) return 5;
      var count = 0;
      for(var i=0; i<5; i++){
          if(dancecardService.dancecard[i].userid == -1){
            count++;
          }
      }
      return count;
    }

  var dancecardService = {};

      dancecardService.dancecard = [];
      dancecardService.interestedPeople = [];

      dancecardService.getStaticDancecard = function(callback){
        $http({
          method: 'GET',
          url: "staticData/dancecard.json"
        }).
        success(function(data, status, headers, config){
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log('error getting static json file');
        });
      };

      dancecardService.isDancecardFilled = function(){
        return (getNumberFreeDancecardSpots() <= 0);
      };

      dancecardService.initializeDancecard = function(userid){
        dancecardService.dancecard = [];
        dancecardService.interestedPeople = [];
        dancecardService.getDancecardById(userid, function(data){});
        dancecardService.getInterestedPeopleById(userid);
      };

      dancecardService.addInterestedPerson = function(userid){
        dancecardService.interestedPeople.push({userid: parseInt(userid, 10)});
        console.log('people interested in you by id...');
        console.log(dancecardService.interestedPeople);
      };

      dancecardService.noLongerInterested = function(userid){
        for(var i=0; i<dancecardService.dancecard.length; i++){
          if(dancecardService.dancecard[i].userid == userid){
            dancecardService.dancecard[i].mutual = false;
            return;
          }
        }

        for(i=0; i<dancecardService.interestedPeople.length;i++){
          if(dancecardService.interestedPeople[i] == userid){
            dancecardService.interestedPeople.splice(i, 1);
            break;
          }
        }
      };

      dancecardService.hadAddedYou = function(userid){
        for(var i=0; i<dancecardService.interestedPeople.length; i++){
          if ( dancecardService.interestedPeople[i].userid == userid ){
            return true;
          }
        }
        return false;
      };

      dancecardService.setMutual = function(userid){
        for(var i=0; i<dancecardService.dancecard.length; i++){
          if(dancecardService.dancecard[i].userid == userid){
            dancecardService.dancecard[i].mutual = true;
            break;
          }
        }
      };

      dancecardService.getInterestedPeopleById = function(userid){
        // console.log('in dancecard service...');
        // console.log(UiState);
        // console.log(UiState.selfProfile.userid);
        // console.log(UiState.selfProfile.userid);
        $http({
          method: 'GET',
          url: SERVER + "/dancecard/interested/"+userid
        })
        .success(function(data, status, headers, config){
            // if(data.status != "logged_out"){
               dancecardService.interestedPeople  = data;
               //callback(data);

            // }
            // else{
            //   $state.go('sign-up-0');
            // }
        }).
        error(function(data, status, headers, config){
          console.log('error getting dancecard');
        });
      };

      dancecardService.getDancecardById = function(userid, callback){
        // console.log('in dancecard service...');
        // console.log(UiState);
        // console.log(UiState.selfProfile.userid);
        // console.log(UiState.selfProfile.userid);
        $http({
          method: 'GET',
          url: SERVER + "/dancecard/"+userid
        })
        .success(function(data, status, headers, config){
            // if(data.status != "logged_out"){
               data = Profile.makeFullImageUrl(data);
               dancecardService.dancecard = data;
               fillBlankDancecardSpots();
               console.log('...gettinng dancecard...');
               console.log(data);
               $rootScope.$broadcast('dancecard-available');
               //callback(data);

            // }
            // else{
            //   $state.go('sign-up-0');
            // }
        }).
        error(function(data, status, headers, config){
          console.log('error getting dancecard');
        });
      };

      // dancecardService.updateDancecard = function(postData, profileData, callback){
        dancecardService.updateDancecard = function(postData, profileData){

            console.log('in update dancecard service ....');
            console.log(postData);
            console.log(profileData);
        for(var i=0; i<5; i++){
          if(postData.status == 'added'){
            if(dancecardService.dancecard[i].userid == -1){
              $('#select-indicator').css({'top': '-20px', 'opacity': 0});
              dancecardService.dancecard[i] = profileData;
              if(dancecardService.hadAddedYou(profileData.userid)){
                dancecardService.dancecard[i].mutual = 'true';
              }
              $rootScope.$broadcast('dancecard-update');
              dancecardService.postDancecardUpdate(postData, function(data){
                console.log('in dancecard service : changed happened...');
                console.log(data);
                Profile.removeFromPageProfiles(profileData.userid);
                Profile.getProfilesByPage("someurl", 1);
              })
              break;
            }
          }

          if(postData.status == 'removed'){
            console.log('...removing dancecard in dancecarservice...');
            if(dancecardService.dancecard[i].userid == profileData.userid){
              dancecardService.dancecard.splice(i,1);
              dancecardService.dancecard.push({smallimageurls: [SERVER + '/user/user.png'], userid: -1});
              $rootScope.$broadcast('dancecard-update');
              if(Profile.selectedProfile.userid == Profile.selectedForRemoval.userid){
                Profile.selectedProfile = Profile.selfProfile;
              }
              Profile.selectedForRemoval = {};
              dancecardService.postDancecardUpdate(postData, function(data){
                  //dancecard updated...
                SurveyService.submitSurvey(postData, function(){
                });
              });
              break;
            }
          }
        }
      };

        dancecardService.postDancecardUpdate = function(postData, callback){

          console.log('posting dancecard update....');
          console.log(postData);
          $http({
            method: 'POST',
            url: SERVER + "/dancecard",
            data: postData
          }).
          success(function(data, status, headers, config){
              // if(data.status != "logged_out"){
                 callback(data);

              // }
              // else{
              //   $state.go('sign-up-0');
              // }
          }).
          error(function(data, status, headers, config){
            console.log('error posting data: add dancecard failed');
          });
        };


  return dancecardService;
}]);


/*******************************************************************************************************
Init Service  */

appServices.factory('InitService',
  [
    'Profile',
    'DancecardService',
    'NotificationService',
    'Socket',
    'Iframe',

  function(
    Profile,
    DancecardService,
    NotificationService,
    Socket,
    Iframe
  ) {

     function initializeData(user, pref){

        Profile.initializeProfile(user, pref, "someurl")
          .then(function(selfData) {
            console.log('initializeData...selfProfile: ');
            console.log(selfData);
            console.log('initializeData...Profile.selfProfile: ');
            console.log(Profile.selfProfile);
            console.log('initializeData...Profile.getSelfProfile(): ');
            console.log(Profile.getSelfProfile());
          });

        var newUser = typeof(user) === 'object';
        var userid = newUser ? user.userid : user;

        console.log('initialize service...');
        console.log('user ' + userid);

        DancecardService.initializeDancecard(userid);

        if(!newUser){
          NotificationService.initializeNotifications(userid);
        }

        // Socket.emit('register-user', {userid: userid}, function(){});
      }

      return {
        initializeData: initializeData
      };
  }]);

/********************************************************************************************************
//
//    ccccc     ooooo    nnnnnn       tt      rrrrrr     ooooo    ll   ll     eeeee    rrrrrr    ssssss
//   ccc  cc   oo   oo   nn   nn   tttttttt   rr   rr   oo   oo   ll   ll    ee   ee   rr   rr  ss
//   ccc       oo   oo   nn    nn     tt      rr        oo   oo   ll   ll    eeeeee    rr        sssss
//   ccc  cc   oo   oo   nn    nn     tt      rr        oo   oo   ll   ll    ee        rr            ss
//    ccccc     ooooo    nn    nn     tt      rr         ooooo    ll   ll     eeeeee   rr       ssssss
//
//*******************************************************************************************************
 Controllers */

/*******************************************************************************************************
Check Status Controller  */

appControllers.controller('CheckStatusCtrl', ['$scope', '$rootScope', '$state','UiState', 'AuthService', 'Profile', 'DancecardService', 'InitService',
  function($scope, $rootScope, $state, UiState, AuthService, Profile, DancecardService, InitService) {

    AuthService.checkUserStatus(function(data){
      console.log(data);
      if(data.status == "logged_in"){
        InitService.initializeData(data.userid);
        $state.go('main.profileList');
      }
      else if(data.status == "logged_out"){
        $state.go('sign-up-0');
      }
    });

  }]);

/*******************************************************************************************************
Sign-up Controller  */

appControllers.controller('SignupCtrl', ['$scope', '$rootScope', '$state', '$upload', 'UiState', 'SignupService', 'InitService', 'Profile',
  function($scope, $rootScope, $state, $upload, UiState, SignupService, InitService, Profile) {


    // var re5digit=/^\d{5}$/ to check for 5 digit zipcode
    $scope.age_floor = 18;
    $scope.age_ceil = 80;
    $scope.distance_floor = 0;
    $scope.distance_ceil = 100;

    var current_year = new Date().getFullYear();
    var createOptions = function(start, finish, increment){
      var options = [];
          if(increment > 0){
            for(var i=start; i<= finish; i+= increment){
              options.push(i);
            }
          }
          else {
            for(var i=start; i>= finish; i+= increment){
              options.push(i);
            }
          }
          return options;
    };

    var ruleOfSeven = function(year, month, day){
        if(year, month, day) {
          var now = new Date();
          var then = new Date(year || 1980, month - 1 || 11, day || 11);
          var diff = now - then;
          var age = Math.floor(diff/1000/60/60/8765.81)
          var age_min = (age/2 + 7) >= 18 ? age/2 + 7 : 18;
          var age_max = age + 7;
        }
        else {
          age_min = $scope.age_floor;
          age_max = $scope.age_ceil;
        }
        return [age_min, age_max];

    };

    $scope.gender_options = [{name: 'Female', value: 'f'},{name: 'Male', value: 'm'}];
    $scope.day_options = createOptions(1,31,1);
    $scope.month_options = createOptions(1,12,1);
    $scope.year_options = createOptions(current_year-$scope.age_floor, current_year-$scope.age_ceil, -1);

    $scope.user = SignupService.user;
    $scope.user.username;
    $scope.user.password;
    $scope.user.email;
    //$scope.user.dob ={};
    $scope.user.dob_day;
    $scope.user.dob_month;
    $scope.user.dob_year;
    $scope.user.gender;
    $scope.user.zipcode;
    $scope.user.personal_blurb;
    $scope.user.mediumImageUrl;
    $scope.user.smallImageUrl;
    $scope.user.originalImageUrl;
    $scope.user.displayImage;

    $scope.pref = SignupService.pref;
    $scope.pref.male = false;
    $scope.pref.female = false;
    $scope.pref.age_max;
    $scope.pref.age_min;
    $scope.pref.distance_max = 25;

    $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      console.log(file);
      $scope.upload = $upload.upload({
        url: SERVER + '/upload', //upload.php script, node.js route, or servlet url
        // method: POST or PUT,
        // headers: {'header-key': 'header-value'},
        // withCredentials: true,
        data: {myObj: $scope.myModelObj},
        file: file, // or list of files: $files for html5 only
        /* set the file formData name ('Content-Desposition'). Default is 'file' */
        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
        //formDataAppender: function(formData, key, val){}
      }).progress(function(evt) {
        console.log('progress! ');
        console.log(evt);
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        if(!$scope.user.originalImageUrl){
          $scope.user.originalImageUrl = [];
        }
        if(!$scope.user.mediumImageUrl){
          $scope.user.mediumImageUrl = [];
        }
        if(!$scope.user.smallImageUrl){
          $scope.user.smallImageUrl = [];
        }
        $scope.user.displayImage = SERVER + data.medImageUrl;
        $scope.user.originalImageUrl.push(data.origImageUrl);
        $scope.user.mediumImageUrl.push(data.medImageUrl);
        $scope.user.smallImageUrl.push(data.smallImageUrl);
        // $scope.mediumImage = "http://lorempixel.com/200/200/sports/";
        console.log(data);
      });
      //.error(...)
      //.then(success, error, progress);
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
    }
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
  };

    $scope.goBack = function(){
    console.log('go back button clicked');
      $state.go(UiState.previousState.name);
    };

    $scope.beginSignup = function(){
        $state.go('sign-up-1');
        SignupService.requestInfoFromBackground('YO Yo Yo, background!');
    };

    $scope.goToSignupStep2 = function(user){
        if (user.$valid) {
          $state.go('sign-up-2');

        }
    };

    $scope.goToSignupStep3 = function(user){
        if (user.$valid) {
          rule = ruleOfSeven($scope.user.dob_year, $scope.user.dob_month, $scope.user.dob_day);
          $scope.pref.age_min = rule[0];
          $scope.pref.age_max = rule[1];
          $state.go('sign-up-3');
        }
    };

    $scope.createAccount = function(user){
       // $state.go('main.profileList');
       console.log('create Account!!!');
       if (user.$valid) {
         SignupService.signupUser(function(data){
            console.log('Signing up user...');
            console.log(data);
            InitService.initializeData(data.user, data.pref);
            // Profile.getStaticProfileList(function(data){

            // });
         });
         // SignupService.requestInfoFromBackground('YO Yo Yo, background!')
          $rootScope.$broadcast('start-tutorial');
          $state.go('main.profileList', { reload: true, inherit: false, notify: false});
      }
    };

}]);



/*******************************************************************************************************
Login Controller  */

appControllers.controller('LoginCtrl',
  [
    '$scope',
    '$state',
    'AuthService',
    'InitService',

    function ($scope, $state, AuthService, InitService) {

      $scope.email = '';
      $scope.password = '';

      console.log(url_info);
      $scope.login = function () {
              AuthService.loginUser({
                email: $scope.email,
                password: $scope.password
              })
              .then(function(data){
                if(data){
                  console.log('data returned from login process');
                  console.log(data);
                  console.log('User should be logged in...');

                  InitService.initializeData(data.userid);

                  $state.go('main.profileList', {reload: true, inherit: false, notify: false});
                }
              });
      };
    }
  ]);


/*******************************************************************************************************
NotificationCtrl Controller  */

appControllers.controller('NotificationCtrl', ['$rootScope','$scope', '$state', 'UiState', 'NotificationService', 'Profile', 'MessageService',
  function($rootScope, $scope, $state, UiState, NotificationService, Profile, MessageService) {

    $scope.notifications = NotificationService.notifications;
    $scope.showExtraMessage = {};
    var previousIndex = -1;

    function resetShowExtra(i){
      for(var key in $scope.showExtraMessage){
        if(key != i ){
         $scope.showExtraMessage[key] = false;
       }
      }
    }

    $scope.markRead = function(index) {
      // console.log('mark this (' + index + ') notification read');
      NotificationService.markRead(index);
    };

    $scope.isRead = function(index) {
      // console.log('you moused over ' + index + ' notification');
      return (NotificationService.notifications[index].status == 'read');
    };

    $scope.hasExtraMessage = function(index){
      console.log('in has extra message');
      console.log(NotificationService.notifications[index].extar_message);
      return (NotificationService.notifications[index].extra_message);
    };

    $scope.showExtra = function(index){
      return ($scope.showExtraMessage[index]) ? true : false;
    };

    $scope.followNotificationSender = function(i){
      console.log($scope.notifications[i]);
      var notification = $scope.notifications[i];
      if(notification.type == "dancecard" && (notification.subtype == "added" || notification.subtype == "removed") ){
        //go to profile in details panel
        if(notification.subtype == 'removed'){
          if(!notification.extra_message){
            console.log('this user id for notification...');
            console.log(notification.userid);

             notification.extra_message = "They had nothing to say...";

          }
          if(notification.message.substring(0,3).toLowerCase() !=  'you'){
            resetShowExtra(i);
            $scope.showExtraMessage[i] =  $scope.showExtraMessage[i] ? false : true;
          }
          // if($scope.previousIndex != -1){
          //   $scope.showExtraMessage[$scope.previousIndex] = false;
          // }
          console.log('notification removeal clicked ...should show extra message');
          console.log($scope.showExtraMessage[i]);
          console.log($scope.showExtraMessage);

        }
        Profile.getProfileById(notification.about_userid, function(data){
          console.log('getting user from notifications...');
          console.log(data);

          UiState.selectProfile(data[0], 'notifications');
           // if(previousIndex != i){ 

              // UiState.openDetailsPanel();
           //    previousIndex = i;
           // }
           // else {
           //  UiState.closeDetailsPanel();
           //  previousIndex = -1;
           // }

        });

      }
      if(notification.subtype == 'mutual' || notification.type == 'message'){
        Profile.getProfileById(notification.about_userid, function(data){
          console.log('getting user from notifications...');
          console.log(data);
          Profile.selectedProfile = data[0];
          $rootScope.$broadcast('profile-selected-notification');
          console.log(Profile.selectedProfile);
          MessageService.getConversationWith(Profile.selectedProfile.userid);
          $state.go('main.messages');
      });
    }
  };
}]);

/*******************************************************************************************************
Message Controller  */

appControllers.controller('MessageCtrl',
  [
    '$rootScope',
    '$scope',
    '$timeout',
    '$state',
    'UiState',
    'Profile',
    'MessageService',
    'Socket',

    function ($rootScope, $scope, $timeout, $state, UiState, Profile, MessageService, Socket) {

      // $scope.messageThread = $scope.conversation;//inherited from DanceCardCtrl
      $scope.newMessage = null;
      UiState.showShortProfile = true;

      $scope.$on('$destroy', function(event){
        console.log('goodbye message controller..');
        UiState.showShortProfile = false;
      });

      $scope.ifSentByUser = function(i){
        return !!$scope.conversation && ($scope.conversation[i].senderid === Profile.getSelfProfile().userid);
      };

      $scope.sendMessage = function(){

        if($scope.newMessage){
          var message = {
            senderid: Profile.getSelfProfile().userid,
            receiverid: $rootScope.selectedProfile.userid,//Profile.getSelectedProfile().userid,
            message: $scope.newMessage,
          };
          MessageService.sendMessageTo(message);
          $scope.newMessage = "";
        }
      };

      $scope.$watch(function () {
         return document.getElementById("messages").innerHTML;
      }, function(val) {
        scrollToBottom();
      });

      var scrollToBottom = function () {
        var element = $('#messages')[0];
        //console.log(element.scrollHeight);

        if (element.offsetHeight < element.scrollHeight) {
          var valueToScroll = element.scrollHeight;
          $("#messages").scrollTop(valueToScroll);
          //element.scrollHeight - element.offsetHeight;
        }
      };
    }
  ]);


/*******************************************************************************************************
TopMenuCtrl Controller  */

appControllers.controller('TopMenuCtrl',
  [
    '$rootScope',
    '$scope',
    '$state',
    '$timeout',
    '$http',
    'UiState',
    'Socket',
    'Profile',
    'NotificationService',
    'DancecardService',
    'MessageService',
    'Iframe',
    'AuthService',

    function (
      $rootScope,
      $scope,
      $state,
      $timeout,
      $http,
      UiState,
      Socket,
      Profile,
      NotificationService,
      DancecardService,
      MessageService,
      Iframe,
      AuthService
    ) {

      $scope.username = '';
      $scope.ns = NotificationService;

      console.log('top menu: checking on notification service read count...');
      console.log(NotificationService);
      console.log($scope.ns.unreadCount);

      // Socket.on('new-notification', function (data) {
      //   console.log('received new notification...');
      //   console.log(data);
      //   NotificationService.addNotification(data);

      //   if(data.type == 'dancecard'){
      //     if(data.subtype == 'mutual'){
      //       console.log("It's a match!...");
      //       DancecardService.setMutual(data.about_userid);
      //     }
      //     else if(data.subtype == 'added'){
      //       DancecardService.addInterestedPerson(data.about_userid);
      //     }
      //     else if(data.subtype == 'removed'){
      //       if(UiState.currentState.name == 'main.messages' && MessageService.chattingWith == data.about_userid ){
      //         $state.go('main.profileList');
      //       }
      //       DancecardService.noLongerInterested(data.about_userid);
      //     }
      //   }
      // });

      $scope.$on('user-data-available', function(event){
        // console.log('username is ready to render! ');
        $scope.username = Profile.getSelfProfile() ? Profile.getSelfProfile().username : '';
      });

      $scope.logout = AuthService.logoutUser;

      $scope.isSignedIn = AuthService.isUserLoggedIn;

      $scope.goBack = function(){
        UiState.showShortProfile = false;
        $state.go('main.profileList');
        // $state.go(UiState.previousState.name);
      };

      $scope.goToProfile = function(){

        Iframe.showProfile({
          userid1: Profile.selfProfile.userid,
          userid2: Profile.selfProfile.userid,
          mutualMatch: false,
          userInDancecard: false,
          dancecardFilled: false
        });

      };

      $scope.goToNotifications = function(){
        $state.go('main.notifications');
      };

      $scope.goToHistory = function(){
        $state.go('main.history-test');
      };

  }
]);
/*******************************************************************************************************
Dancecard Controller  */

appControllers.controller('DanceCardCtrl',
  [
    '$rootScope',
    '$scope',
    '$state',
    '$timeout',
    'UiState',
    'MessageService',
    'DancecardService',
    'Socket',
    'Profile',
    'Iframe',

  function(
    $rootScope,
    $scope,
    $state,
    $timeout,
    UiState,
    MessageService,
    DancecardService,
    Socket,
    Profile,
    Iframe
  ) {

    // DancecardService.getStaticDancecard(function(data){
    //     $scope.danceCard = data;
    // });

    // console.log("Uistate in dancecard controller...");
    // console.log(UiState);


    // Socket.on('new-message', function(data){
    //   console.log('new messsage received...');
    //   console.log(data);
    //   // $scope.conversation.push(data);
    //   MessageService.updateConversationWith(data.senderid, data);
    // });

    $scope.onDropAdd = function(event, data){
      console.log('item dropped...');
      console.log(data);
      console.log(event);

      Profile.selectedProfile = data;
      updateDancecard(data, 'added');

    };

    function updateDancecard(user, status){
      var data = {
        userid: Profile.selfProfile.userid,
        partnerid: user.userid,
        status: status
      };

      if(status == 'added'){
        //remove list select indicator when selecting person from dancecard
            $('.select-indicator').css('visibility', 'hidden');
            $('.select-indicator').css('right', '7px');
         DancecardService.updateDancecard(data, Profile.selectedProfile);
      }

      if(status == 'removed'){
            UiState.showDetailsPanel = false;
            if(user.mutual){
                $state.go('main.removeSurvey');
            }
            else{
                DancecardService.updateDancecard(data, user);
                $state.go('main.profileList');
            }
      }
    }

    $scope.$on('dancecard-update', function(event){
      $scope.dancecard = DancecardService.dancecard;
    });

   $scope.$on('dancecard-available', function(event){
    $scope.dancecard = DancecardService.dancecard;
   });

    $scope.selectOnly = function(i){

      // var closeDetails;
      if($scope.dancecard[i].userid != -1){
        $rootScope.selectedProfile = $scope.dancecard[i];
        // closeDetails = 
        // UiState.selectProfile($scope.dancecard[i], 'dancecard');
        
        Iframe.showProfile({
          userid1: $rootScope.selectedProfile.userid,
          userid2: Profile.getSelfProfile().userid,
          mutualMatch: $rootScope.selectedProfile.mutual,
          userInDancecard: true,
          dancecardFilled: DancecardService.isDancecardFilled()
        });

        if($scope.dancecard[i].mutual){
          UiState.showShortProfile = true;
          // closeDetails ? UiState.closeDetailsPanel() : 
          // UiState.openDetailsPanel();
          $scope.conversation = [];
          MessageService.getConversationWith($rootScope.selectedProfile.userid);
          $state.go('main.messages');

          //MessageService.getMessageByuserid(UiState.selectedProfile.userid);
          // getConversation(Profile.selectedProfile.userid);
        }
        else {
           $( "#detailsContent" ).addClass('dancecard');
          // closeDetails ? UiState.closeDetailsPanel() : 
          // UiState.openDetailsPanel();
          $state.go('main.profileList');
        }
      }
    };

    $scope.$on('profile-selected-notification', function(event){
      $scope.selectedProfile = $rootScope.selectedProfile;//Profile.getSelectedProfile();
    });

    $scope.$on('conversation-available', function(event, data){
      console.log('conversation is available...');
      console.log(data);
      // $scope.$apply(function(){
        $scope.conversation = data;
      // })
    });

    // var getConversation = function(userid){
    //   // MessageService.getStaticMessageByuserid(userid, function(data){
    //   //   $scope.conversation = data;
    //   // });
    //    MessageService.getMessageByuserid(userid, function(data){
    //     $scope.conversation = data;
    //   });
    // }

    var isInDanceCard = function(userid){

      for(var i=0; i<DancecardService.dancecard.length; i++) {
        if(DancecardService.dancecard[i].userid == userid){
          return true;
        }
      }
      return false;
    };

    var isMutual = function(userid){
      for(var i=0; i<DancecardService.dancecard.length; i++) {
        if(DancecardService.dancecard[i].userid == userid){
          return DancecardService.dancecard[i].mutual;
        }
      }
      return false;
    };

    $scope.showDetailedProfile = function(){
      // UiState.showDetailsPanel = true;
      // var closeDetails;
      // closeDetails = 
      // UiState.selectProfile(Profile.selectedProfile, 'dancecard');

      Iframe.showProfile({
        userid1: $rootScope.selectedProfile.userid,
        userid2: Profile.getSelfProfile().userid,
        mutualMatch: isMutual($rootScope.selectedProfile.userid),
        userInDancecard: isInDanceCard(Profile.selectedProfile.userid),
        dancecardFilled: DancecardService.isDancecardFilled()
      });
      // closeDetails ? UiState.closeDetailsPanel() : 
      // UiState.openDetailsPanel();
    };

    $scope.ifSelected = function(i){
      return ($rootScope.selectedProfile.userid == $scope.dancecard[i].userid && $scope.dancecard[i].userid != -1);
    };

    $scope.isMutual = function(i){
      return ($scope.dancecard[i].mutual);
    };

    $scope.isNotPlaceholder = function(i){
      console.log('isnotplaceholder?');
      console.log($scope.dancecard[i].userid);
      return ($scope.dancecard[i].userid != -1);
    };

    $scope.conversation = [];
    $scope.uiState = UiState;
    $scope.selectedProfile = $rootScope.selectedProfile;//Profile.selectedProfile;

  }]);






