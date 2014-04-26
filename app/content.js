
var url_info = {};

/***************************************************************************
/
/ Communication between background.js 
/
/***************************************************************************/

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	console.log("Message received in content script");
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	// console.log("in content.js:  message received from extension ");
	// console.log("message: ");
	// console.log(message);
	// console.log("sender: ");
	// console.log(sender);
	//console.log("sendResponse: " + sendResponse);
	switch(message.type) {
		case "open-sidebar":
			if($('#injected-content').length == 0){
				console.log('opening sidebar');
        console.log(message.data);
        url_info = message.data;
				$.get(chrome.extension.getURL('/content.html'), function(data) {
				    	$(data).appendTo('body');
				    	bootstrapApp();
				});
			}
			break;
		case "close-sidebar":
			console.log('closing sidebar');
			$('#injected-content').remove();
			break;
	}
});

/***************************************************************************
/
/ Angular Code, app config, services/factories (models),  and controllers
/
/***************************************************************************/


/* Angular-specific code goes here (i.e. defining and configuring
 * modules, directives, services, filters, etc.) */

var sidebarApp = angular.module('sidebarDatingExt',[
  'vr.directives.slider',
  'angular-carousel',
  'angularFileUpload',
  'ui.router',
  'appControllers',
  'appServices'
]);


sidebarApp.config(['$sceDelegateProvider', '$stateProvider', '$sceProvider',
  function($sceDelegateProvider, $stateProvider, $sceProvider) {

    $sceProvider.enabled(false);
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from outer templates domain.
      'chrome-extension://*/partials/**'
    ]); 

    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        // .state('file-upload-teset', {
        //   url: '',
        //   views: {
        //     'sidebar': {
        //       templateUrl: chrome.extension.getURL('partials/fileUploadTest.html'),
        //       controller: 'UploadTestCtrl'
        //     }
        //   }
        // })
        // HOME STATES AND NESTED VIEWS ========================================

        .state('check-status', {
          url: '',
          views: {
            'sidebar': {
              templateUrl: chrome.extension.getURL('partials/checkStatus.html'),
              controller: 'CheckStatusCtrl'
            }
          }
        })

        .state('sign-up-0', {
          url: '',
          views: {   
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/signup0.html'),
                controller: 'SignupCtrl'
              }
          }
        })

        .state('sign-up-1', {
          url: '',
          views: {   
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/signup1.html'),
                controller: 'SignupCtrl'
              }
          }
        })

        .state('sign-up-2', {
          url: '',
          views: {   
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/signup2.html'),
                controller: 'SignupCtrl'
              }
          }
        })

        .state('sign-up-3', {
          url: '',
          views: {   
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/signup3.html'),
                controller: 'SignupCtrl'
              }
          }
        })

        .state('login', {
          url: '',
          views: {   
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/login.html'),
                controller: 'LoginCtrl'
              }
          }
        })

        .state('history-test', {
          url: '',
          views: {
            'sidebar': {
              templateUrl: chrome.extension.getURL('partials/historyTest.html'),
              controller: 'HistoryTestCtrl'
            }
          }
        })

        .state('main', {
          views: {   
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/danceCardMenu.html'),
                controller: 'DanceCardCtrl'
              },
              'detailsPanel': {
                templateUrl: chrome.extension.getURL('partials/profileDetails.html'),
                controller: 'ProfileDetailCtrl'
              }
          }
        })

        .state('main.notifications', {
          url: '',
          templateUrl: chrome.extension.getURL('partials/notifications.html'),
            controller: 'NotificationCtrl'
            })

        .state('main.profileList', {
          url: '',
          templateUrl: chrome.extension.getURL('partials/profileList.html'),
            controller: 'ProfileListCtrl'
            })

        .state('main.removeSurvey', {
          url: '',
          templateUrl: chrome.extension.getURL('partials/removeSurvey.html'),
            controller: 'RemoveSurveyCtrl'
            })
        
        .state('main.messages', {
              url: '',
          templateUrl: chrome.extension.getURL('partials/messages.html') ,
            controller: 'MessageCtrl'
            })

        .state('main.detailsPanel', {
                url: '',
              controller: '',
              templateUrl: chrome.extension.getURL('partials/profileSelf.html')
        });


        console.log("i'm in config for the app");
  }]);

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

var appServices = angular.module('appServices', ['ngResource']);

/*******************************************************************************************************
Ui State Service  */

appServices.factory('UiState', function(){

  var uiStateService = {};

  // uiStateService.pageProfiles = {};
  // uiStateService.selectedProfile = {};
  // uiStateService.selfProfile = {};

  //uiStateService.selfUserId;//0 for static data 

  // uiStateService.dancecard = {};

  uiStateService.previousState;
  uiStateService.showSidebar = true;
  uiStateService.showDetailsPanel = false;

  return uiStateService;
});

/*******************************************************************************************************
Socket IO Wrapper Service  */


appServices.factory('Socket', function ($rootScope) {
  var socket = io.connect('http://localhost:3000');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

/*******************************************************************************************************
Message Service  */

appServices.factory('MessageService', ['$http', '$state', 'Profile', 
  function($http, $state, Profile){
  
  var messageService = {};

      messageService.getStaticMessages = function(callback){
        $http({
          method: 'GET',
          url: chrome.extension.getURL("staticData/messages.json")
        }).
        success(function(data, status, headers, config){
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log('error getting static json file');
        }); 
      }

      messageService.getStaticMessageByuserid = function(userid, callback){
        $http({
          method: 'GET',
          url: chrome.extension.getURL("staticData/message_user" + userid + ".json")
        }).
        success(function(data, status, headers, config){
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log('error getting static json file');
        }); 
      }

      messageService.getMessageByuserid = function(userid, callback){
        $http({
          method: 'GET',
          url: "http://localhost:3000/message/" + userid + "/?userId=" + Profile.selfProfile.userid
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
          console.log('error getting static json file');
        }); 
      }

      messageService.sendMessageTouserid = function(message, callback){
        if(message.senderid != message.receiverid){
          $http({
            method: 'POST',
            url: "http://localhost:3000/message/",
            data: message
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
            console.log('error posting message');
          }); 
        }
        else{
          console.log('Cannot send message to yourself');
        }
      }

  return messageService;
}]);

/*******************************************************************************************************
Notification Service  */

appServices.factory('NotificationService', ['$http', '$state', 'Profile', 
  function($http, $state, Profile){
  
  var notificationService = {};
      /*
            notificationid  SERIAL,
            userid      int REFERENCES users (userid) ON DELETE CASCADE,
            message     varchar(140) NOT NULL,  
            action_time   timestamp,
            type      varchar(50),--message/dancecard
            status      varchar(50),--read/unread/ignore
      */

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
      }

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
      }

      notificationService.addNotification = function(notification){
          notificationService.notifications.unshift(notification);
          notificationService.unreadCount++;
      }

      notificationService.initializeNotifications = function(userid){
        notificationService.getNotifications(userid);
      }

      notificationService.getNotifications = function(userid){
        $http({
          method: 'GET',
          url: "http://localhost:3000/notifications/" + userid
        }).
        success(function(data, status, headers, config){
            // if(data.status != "logged_out"){
               // callback(data); 
               console.log(data);
               notificationService.notifications = data;
               notificationService.getUnreadCount()
            // }
            // else{
            //   $state.go('sign-up-0');
            // }
        }).
        error(function(data, status, headers, config){
          console.log('error getting static json file');
        }); 
      }

      notificationService.updateNotificationStatus = function(data){
          $http({
            method: 'POST',
            url: "http://localhost:3000/notifications/",
            data: data
          }).
          success(function(data, status, headers, config){
               // callback(data);
               //update

          }).
          error(function(data, status, headers, config){
            console.log('error posting message');
          }); 
        }

  return notificationService;
}]);


/*******************************************************************************************************
Dancecard Service  */

appServices.factory('DancecardService', ['$rootScope', '$http', 'Profile',
  function($rootScope, $http, Profile){
  
  function fillBlankDancecardSpots(){
     var curDancecardLength = dancecardService.dancecard.length;
     for(var i=0; i<(5-curDancecardLength); i++){
       dancecardService.dancecard.push({smallimageurls: ['http://localhost:3000/user/user.png'], userid: -1}); 
     }
  }

  function getNumberFreeDancecardSpots(){
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
          url: chrome.extension.getURL("staticData/dancecard.json")
        }).
        success(function(data, status, headers, config){
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log('error getting static json file');
        }); 
      }

      dancecardService.isDancecardFilled = function(){
        return (getNumberFreeDancecardSpots() <= 0);
      }

      dancecardService.initializeDancecard = function(userid){
        dancecardService.dancecard = [];
        dancecardService.interestedPeople = [];
        dancecardService.getDancecardById(userid, function(data){});
        dancecardService.getInterestedPeopleById(userid);
      }

      dancecardService.addInterestedPerson = function(userid){
        dancecardService.interestedPeople.push({userid: parseInt(userid)});
        console.log('people interested in you by id...');
        console.log(dancecardService.interestedPeople);
      }

      dancecardService.noLongerInterested = function(userid){
        for(var i=0; i<dancecardService.dancecard.length; i++){
          if(dancecardService.dancecard[i].userid == userid){
            dancecardService.dancecard[i].mutual = false;
            return;
          }
        }

        for(var i=0; i<dancecardService.interestedPeople.length;i++){
          if(dancecardService.interestedPeople[i] == userid){
            dancecardService.interestedPeople.splice(i, 1);
            break;
          }
        }
      }

      dancecardService.hadAddedYou = function(userid){
        for(var i=0; i<dancecardService.interestedPeople.length; i++){
          if ( dancecardService.interestedPeople[i].userid == userid ){
            return true;
          }
        }
        return false;
      }

      dancecardService.setMutual = function(userid){
        for(var i=0; i<dancecardService.dancecard.length; i++){
          if(dancecardService.dancecard[i].userid == userid){
            dancecardService.dancecard[i].mutual = true;
            break;
          }
        }
      } 

      dancecardService.getInterestedPeopleById = function(userid){
        // console.log('in dancecard service...');
        // console.log(UiState);
        // console.log(UiState.selfProfile.userid);
        // console.log(UiState.selfProfile.userid);
        $http({
          method: 'GET',
          url: "http://localhost:3000/dancecard/interested/"+userid
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
      }

      dancecardService.getDancecardById = function(userid, callback){
        // console.log('in dancecard service...');
        // console.log(UiState);
        // console.log(UiState.selfProfile.userid);
        // console.log(UiState.selfProfile.userid);
        $http({
          method: 'GET',
          url: "http://localhost:3000/dancecard/"+userid
        })
        .success(function(data, status, headers, config){
            // if(data.status != "logged_out"){
               dancecardService.dancecard = data;
               fillBlankDancecardSpots();
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
      }

      // dancecardService.updateDancecard = function(postData, profileData, callback){
        dancecardService.updateDancecard = function(postData, profileData){

        for(var i=0; i<5; i++){
          if(postData.status == 'added'){
            if(dancecardService.dancecard[i].userid == -1){
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
            if(dancecardService.dancecard[i].userid == profileData.userid){
              dancecardService.dancecard.splice(i,1);
              dancecardService.dancecard.push({smallimageurls: ['http://localhost:3000/user/user.png'], userid: -1});
              $rootScope.$broadcast('dancecard-update');
              Profile.selectedProfile = Profile.selfProfile;
              dancecardService.postDancecardUpdate(postData, function(data){
                //
              })
              break;
            }
          }
        }
      }

        dancecardService.postDancecardUpdate = function(postData, callback){

          $http({
            method: 'POST',
            url: "http://localhost:3000/dancecard",
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
        }
      

  return dancecardService;
}]);

/*******************************************************************************************************
Profile Service  */

appServices.factory('Profile', ['$rootScope', '$http', '$state',
  function($rootScope, $http, $state){

    var profileFactory = {};

    profileFactory.pageProfiles = [];
    profileFactory.selectedProfile = {};
    profileFactory.selfProfile = {};

    profileFactory.initializeProfile = function(user, url){
      if(typeof(user) == 'object'){
        profileFactory.selfProfile = user;
        profileFactory.selectedProfile = user;
        profileFactory.initializePageProfiles(url);
        $rootScope.$broadcast('user-data-available');
      }
      else{
        profileFactory.getProfileById(user, function(data){
          profileFactory.selfProfile = data[0];
          profileFactory.selectedProfile = data[0];
          profileFactory.getProfilesByPage(url, 10);
          $rootScope.$broadcast('user-data-available');
        })
      }
    }

    profileFactory.removeFromPageProfiles = function(userid){
      for(var i=0; i<profileFactory.pageProfiles.length; i++){
        if(profileFactory.pageProfiles[i].userid == userid){
          profileFactory.pageProfiles.splice(i, 1);
          break;
        }
      }
    }

    profileFactory.getStaticProfileList = function(callback){
      $http({
        method: 'GET',
        url: chrome.extension.getURL("staticData/profiles.json")
      }).
      success(function(data, status, headers, config){
        callback(data);
      }).
      error(function(data, status, headers, config){
        console.log('error getting static json file');
      }); 
    }

    profileFactory.getProfileById = function(userid, callback){
      $http({
        method: 'GET',
        url: 'http://localhost:3000/profile/'+userid
      }).
      success(function(data, status, headers, config){
        // if(data.status != "logged_out"){
           callback(data);  
        // }
        // else{
        //     $state.go('sign-up-0');
        // }
      }).
      error(function(data, status, headers, config){
        console.log('error getting user profile ' + userid);
      }); 
    }

    profileFactory.getProfilesByInterest = function(userid, callback){
    }

    profileFactory.getProfilesByPage = function(url, limit){
       var userid = profileFactory.selfProfile.userid;
       var queryString = "url=" + url + "&userid=" + userid + "&limit=" +limit;
       
      if(profileFactory.pageProfiles.length > 0){
         queryString += "&pageprofiles="; 
         for(var i=0; i<profileFactory.pageProfiles.length; i++){
             queryString += profileFactory.pageProfiles[i].userid;
             if(i != profileFactory.pageProfiles.length -1){
                queryString += ',';
             } 
         }
      }

       $http({
          method: 'GET', 
          url: 'http://localhost:3000/crowd/?' + queryString
        }).
      success(function(data, status, headers, config) {
        // if(data.status != "logged_out"){
           //callback(data);   // this callback will be called asynchronously when the response is available
          // console.log(data);
          profileFactory.pageProfiles = profileFactory.pageProfiles.concat(data);
          $rootScope.$broadcast('page-profiles-available');
        // }
        // else{
        //   $state.go('sign-up-0');
        // }
      }).
      error(function(data, status, headers, config) {
        console.log('get people failure');
      });
    }

    return profileFactory;

  }]);

/*******************************************************************************************************
Signup Service  */

appServices.factory('SignupService', ['$http', 'Profile',
  function($http, Profile){

    var signupService = {};

    signupService.user = {};
    signupService.pref = {};

    signupService.requestInfoFromBackground = function(message){
        chrome.runtime.sendMessage({type: 'request', command: message}, function(response) {
          console.log('response from background script...');
          console.log(response);
        });
    }

    signupService.signupUser = function(callback){
      $http({
        method: 'POST',
        url: "http://localhost:3000/signup",
        data: {user: this.user, pref: this.pref}
      }).
      success(function(data, status, headers, config){
        // callback(data);
        Profile.selfProfile = data;
      }).
      error(function(data, status, headers, config){
        console.log('error signing up user: sending data to server failed');
      }); 
    }

    return signupService;

  }]);

/*******************************************************************************************************
Signup Service  */

appServices.factory('HistoryService', ['$http', 'Profile',
  function($http, Profile){

    var historyService = {};

    historyService.currentUrl;

    historyService.getHistory = function(callback){
        var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
        var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
        var limit = 10;

        chrome.runtime.sendMessage({type: 'history', time_ago: oneWeekAgo, limit: limit}, function(response) {
            console.log('response from background script...');
            console.log(response);
            // $scope.output = response;
            callback(response);
          });
      };


    historyService.saveHistory = function(data, callback){
      $http({
        method: 'POST',
        url: "http://localhost:3000/history",
        data: {userid: Profile.selfProfile.userid, history: data}
      }).
      success(function(data, status, headers, config){
        callback(data);
      }).
      error(function(data, status, headers, config){
        console.log('error saving history data...');
      }); 
    }

    return historyService;

  }]);

/*******************************************************************************************************
Login Service  */

appServices.factory('LoginService', ['$http', 'Socket',
  function($http, Socket){

    var loginService = {};

    loginService.loginUser = function(credentials, callback){
      $http({
        method: 'POST',
        url: "http://localhost:3000/login",
        data: credentials
      }).
      success(function(data, status, headers, config){
        callback(data);
        
      }).
      error(function(data, status, headers, config){
        console.log('error logging in user');
      }); 
    }

    return loginService;

  }]);

/*******************************************************************************************************
Authentication Service  */

appServices.factory('AuthService', ['$http',
  function($http){

    var authService = {};

    authService.checkUserStatus = function(callback){
      $http({
        method: 'GET',
        url: "http://localhost:3000/authentication_status"
      }).
      success(function(data, status, headers, config){
        callback(data);
      }).
      error(function(data, status, headers, config){
        console.log('error logging in user');
      }); 
    }

    return authService;

  }]);

/*******************************************************************************************************
Init Service  */

appServices.factory('InitService', ['$rootScope', 'UiState','Profile','DancecardService', 'Socket', 'NotificationService',
  function($rootScope, UiState, Profile, DancecardService, Socket, NotificationService){

         var initService = {};

         initService.initializeData = function(user){

            Profile.initializeProfile(user, "someurl");

            var userid = typeof(user) == 'object' ? user.userid : user;

            DancecardService.initializeDancecard(userid);
            NotificationService.initializeNotifications(userid);
            Socket.emit('register-user', {userid: userid}, function(){});            
          };

          return initService;
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

var appControllers = angular.module('appControllers', []);

/*******************************************************************************************************
History Test Controller  */

appControllers.controller('HistoryTestCtrl', ['$scope', '$upload', '$rootScope', '$state', 'HistoryService',
    function($scope, $upload, $rootScope, $state, HistoryService) {
      $scope.history;
      $scope.time_ago;
      $scope.output;

      $scope.getHistory = function(){
        HistoryService.getHistory(function(response){
            $scope.$apply(function(){
              $scope.history = response;
            });
            HistoryService.saveHistory(response, function(data){
              console.log('returned from saveHistory...');
              console.log(data);
            });
        });
      }

  }]);


/*******************************************************************************************************
Upload Test Controller  */

appControllers.controller('UploadTestCtrl', ['$scope', '$upload', '$rootScope', '$state',
    function($scope, $upload, $rootScope, $state) {

        $scope.largeImage = "http://localhost:3000/userId_1.jpg";
        $scope.mediumImage = "http://localhost:3000/thumb_okc_profile2.jpg"; 

$scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      console.log(file);
      $scope.upload = $upload.upload({
        url: 'http://localhost:3000/upload', //upload.php script, node.js route, or servlet url
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
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        $scope.largeImage = "http://localhost:3000/" + file.name;
        $scope.mediumImage = "http://localhost:3000/thumb_"+ file.name; 
        // $scope.mediumImage = "http://lorempixel.com/200/200/sports/";
        // console.log(data);
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

  }]);

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

appControllers.controller('SignupCtrl', ['$scope', '$state', '$upload', 'UiState', 'SignupService', 'InitService',
  function($scope, $state, $upload, UiState, SignupService, InitService) {

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

    var ruleOfSeven = function(){
      var now = new Date();
      var then = new Date($scope.user.dob_year || 1980, $scope.user.dob_month-1 || 11, $scope.user.dob_day || 11);
      var diff = now - then;
      var age = Math.floor(diff/1000/60/60/8765.81)
      $scope.pref.age_min = (age/2 + 7) >= 18 ? age/2 + 7 : 18;
      $scope.pref.age_max = age + 7;
    }

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
        url: 'http://localhost:3000/upload', //upload.php script, node.js route, or servlet url
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

    $scope.beginSignup = function(){
        $state.go('sign-up-1');
        SignupService.requestInfoFromBackground('YO Yo Yo, background!');
    }

    $scope.goToSignupStep2 = function(){
        $state.go('sign-up-2');
    }

    $scope.goToSignupStep3 = function(){
        ruleOfSeven();
        $state.go('sign-up-3');
    }

    $scope.createAccount = function(){
       // $state.go('main.profileList');
       SignupService.signupUser(function(data){
          console.log('Signing up user...');
          console.log(data);
          InitService.initializeData(data.user);
       });
       // SignupService.requestInfoFromBackground('YO Yo Yo, background!');
       $state.go('main.profileList', { reload: true, inherit: false, notify: false});
    }

}]);

/*******************************************************************************************************
Login Controller  */

appControllers.controller('LoginCtrl', ['$scope', '$state', 'LoginService', 'InitService', 'Socket',
  function($scope, $state, LoginService, InitService, Socket) {

    $scope.email;
    $scope.password;

    console.log(url_info);
    $scope.login = function(){
            LoginService.loginUser({email: $scope.email, password: $scope.password}, function(data){
            if(data){ 
              console.log('data returned from login process');
              console.log(data);
              console.log('User should be logged in...');

              InitService.initializeData(data.userid);

            // $state.go('main.profileList', {reload: true, inherit: false, notify: false});
            $state.go('history-test', {reload: true, inherit: false, notify: false});
          }
        });
    }

  }]);


/*******************************************************************************************************
NotificationCtrl Controller  */

appControllers.controller('NotificationCtrl', ['$rootScope','$scope', '$state', 'UiState', 'NotificationService',
  function($rootScope, $scope, $state, UiState, NotificationService) {

    $scope.notifications = NotificationService.notifications;

    $scope.markRead = function(index) {
      console.log('mark this (' + index + ') notification read');
      NotificationService.markRead(index);
    };
    
    $scope.isRead = function(index) {
      console.log('you moused over ' + index + ' notification');
      return (NotificationService.notifications[index].status == 'read');
    }

}]);

/*******************************************************************************************************
Message Controller  */

appControllers.controller('MessageCtrl', ['$scope', '$timeout', '$state', 'UiState', 'Profile', 'MessageService', 'Socket',
  function($scope, $timeout, $state, UiState, Profile, MessageService, Socket) {

    $scope.messageThread = $scope.conversation;//inherited from DanceCardCtrl
    $scope.newMessage;

    console.log($scope.conversation);
    $scope.ifSentByUser = function(i){
      return ($scope.conversation[i].senderid ==  Profile.selfProfile.userid)
    }

    $scope.sendMessage = function(){

      if($scope.newMessage){
        var message = {
          senderid: Profile.selfProfile.userid,
          receiverid: Profile.selectedProfile.userid,
          message: $scope.newMessage,
        }
        $scope.conversation.push(message);
        MessageService.sendMessageTouserid(message, function(data){
          //post response data?
          // console.log('post of message a success');
        });
        $scope.newMessage = "";
      }
    }

    $scope.$watch(function () {
       return document.getElementById("messages").innerHTML;
    }, function(val) {
      scrollToBottom();
    });

    var scrollToBottom = function(){
       var element = $('#messages')[0];
       //console.log(element.scrollHeight);
         
       if( (element.offsetHeight < element.scrollHeight)){
         var valueToScroll = element.scrollHeight;
         $("#messages").scrollTop(valueToScroll);
          //element.scrollHeight - element.offsetHeight;
       }
     }
  }]);


/*******************************************************************************************************
TopMenuCtrl Controller  */

appControllers.controller('TopMenuCtrl', ['$rootScope','$scope', '$state', 'UiState', 'Socket', 'Profile', 'NotificationService', 'DancecardService',
  function($rootScope, $scope, $state, UiState, Socket, Profile, NotificationService, DancecardService) {

  $scope.username = Profile.selfProfile.username;
  $scope.ns = NotificationService;

  console.log('top menu: checking on notification service read count...');
  console.log(NotificationService);
  console.log($scope.ns.unreadCount);

  Socket.on('new-notification', function(data){
    console.log('received new notification...');
    console.log(data);
    NotificationService.addNotification(data);
    
    if(data.type == 'dancecard'){
      if(data.subtype == 'mutual'){
        console.log("It's a match!...");
        DancecardService.setMutual(data.about_userid); 
      }
      else if(data.subtype == 'added'){
        DancecardService.addInterestedPerson(data.about_userid);
      }
      else if(data.subtype == 'removed'){
        DancecardService.noLongerInterested(data.about_userid);
      }
    }
  });

  $scope.$on('user-data-available', function(event){
    // console.log('username is ready to render! ');
    $scope.username = Profile.selfProfile.username;
  });

  $scope.isSignedIn = function(){
    return true;
  }

  $scope.goBack = function(){
    $state.go('main.profileList');
  }

  $scope.goToProfile = function(){
      if(Profile.selectedProfile != Profile.selfProfile){
        Profile.selectedProfile = Profile.selfProfile;
      }
      UiState.showDetailsPanel = true;
    }

  $scope.goToNotifications = function(){
    $state.go('main.notifications');
  }

}]);
/*******************************************************************************************************
Dancecard Controller  */

appControllers.controller('DanceCardCtrl', ['$rootScope','$scope', '$state', 'UiState', 'MessageService', 'DancecardService', 'Socket', 'Profile',
  function($rootScope, $scope, $state, UiState, MessageService, DancecardService, Socket, Profile) {
    
    // DancecardService.getStaticDancecard(function(data){
    //     $scope.danceCard = data;
    // });
  
    // console.log("Uistate in dancecard controller...");
    // console.log(UiState);
    

    Socket.on('new-message', function(data){
      console.log('new messsage received...');
      console.log(data);
      $scope.conversation.push(data);
    });


    $scope.$on('dancecard-update', function(event){
      $scope.dancecard = DancecardService.dancecard;
    });

     $scope.$on('dancecard-available', function(event){
      $scope.dancecard = DancecardService.dancecard;
      });


    $scope.selectOnly = function(i){
        if($scope.dancecard[i].userid != -1){
          Profile.selectedProfile = $scope.dancecard[i];
          $scope.selectedProfile = $scope.dancecard[i];
          $scope.showShortProfile = true;
          if($scope.dancecard[i].mutual){
            $state.go('main.messages');
            //MessageService.getMessageByuserid(UiState.selectedProfile.userid);
            getConversation(Profile.selectedProfile.userid);
          }
        }
      }

      var getConversation = function(userid){
        // MessageService.getStaticMessageByuserid(userid, function(data){
        //   $scope.conversation = data;
        // });
        MessageService.getMessageByuserid(userid, function(data){
          $scope.conversation = data;
        });
      }

      $scope.showDetailedProfile = function(){
        UiState.showDetailsPanel = true;
      }

      $scope.ifSelected = function(){
        return (Profile.selectedProfile.userid == $scope.selectedProfile.userid && $scope.selectedProfile != -1);
      }

      $scope.isMutual = function(i){
        return ($scope.dancecard[i].mutual);
      }

    $scope.conversation = [];
    $scope.showShortProfile = false;
    $scope.selectedProfile = -1;

  }]);

/*******************************************************************************************************
Profile List Controller  */

appControllers.controller('ProfileListCtrl', ['$scope', 'Profile', 'UiState',
  function($scope, Profile, UiState) {

    $scope.profiles = Profile.pageProfiles;
    
    $scope.$on('page-profiles-available', function(event){
      $scope.profiles = Profile.pageProfiles;
    });

    $scope.selectOnly = function(i){
      UiState.showDetailsPanel = true;
      Profile.selectedProfile = $scope.profiles[i];
    }

    $scope.ifSelected = function(i){
      return (UiState.showDetailsPanel && Profile.selectedProfile.userid == $scope.profiles[i].userid);
    }

    // $scope.orderProp = 'username'; does not sort UiState.pageProfiles so indexes are out of sync, don't use for now.

  }]);

/*******************************************************************************************************
Profile List Controller  */

appControllers.controller('RemoveSurveyCtrl', ['$scope', '$state', 'Profile', 'UiState', 'DancecardService',
  function($scope, $state, Profile, UiState, DancecardService) {

    $scope.survey;

    $scope.cancel = function(){
      UiState.showDetailsPanel = false;
      $state.go('main.profileList');
    }
    

    $scope.submitSurvey = function(){
      var data = {
        userid: Profile.selfProfile.userid,
        partnerid: Profile.selectedProfile.userid,
        status: 'removed'
      };
      DancecardService.updateDancecard(data, Profile.selectedProfile);
      UiState.showDetailsPanel = false;
      $state.go('main.profileList');
      console.log('you just removed ' + Profile.selectedProfile.username);
    }

    }]);

/*******************************************************************************************************
Profile Detail Controller  */

appControllers.controller('ProfileDetailCtrl', ['$rootScope', '$scope', '$state', 'Profile', 'UiState','DancecardService',
  function($rootScope, $scope, $state, Profile, UiState, DancecardService) {

    $scope.profile = Profile;

    $scope.showAddButton = function(){
      return (!isInDanceCard(Profile.selectedProfile.userid) && !isDancecardFilled() && !$scope.isSelf());
    }

    $scope.showRemoveButton = function(){
      return (isInDanceCard(Profile.selectedProfile.userid) && !$scope.isSelf());
    }

    $scope.showMessageButton = function(){
      return (isMutual(Profile.selectedProfile.userid) && !$scope.isSelf());
    }

    var isInDanceCard = function(userid){

      for(var i=0; i<DancecardService.dancecard.length; i++) {
        if(DancecardService.dancecard[i].userid == userid){
          return true;
        }
      };
      return false; 
    };

    var isMutual = function(userid){
      for(var i=0; i<DancecardService.dancecard.length; i++) {
        if(DancecardService.dancecard[i].userid == userid){
          return DancecardService.dancecard[i].mutual;
        }
      };
      return false; 
    }

    var isDancecardFilled = function(){
      return (DancecardService.isDancecardFilled());
    }

    $scope.isSelf = function(){
      return (Profile.selectedProfile.userid == Profile.selfProfile.userid);
    }

    $scope.updateDancecard = function(userid, status){
      var data = {
        userid: Profile.selfProfile.userid,
        partnerid: userid,
        status: status
      }

      if(status == 'added'){
         DancecardService.updateDancecard(data, Profile.selectedProfile);
      }

      if(status == 'removed'){
            UiState.showDetailsPanel = false;
            // $state.go('main.profileList');
            $state.go('main.removeSurvey');
      }

    };
  }]);

/*******************************************************************************************************
Ui Controller  */

appControllers.controller('uiCtrl', ['$rootScope', '$scope', 'UiState', 'Profile', 'DancecardService',
  function($rootScope, $scope, UiState, Profile, DancecardService){
    var arrowLeftIconURL = chrome.extension.getURL("icons/icon_22996/icon_22996.png");
    var arrowRightIconURL = chrome.extension.getURL("icons/icon_22997/icon_22997.png");

    $scope.uiState = UiState;
    $scope.uiState.showSidebar = true;

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
       //assign the "from" parameter to something
       console.log('pervious state...');
       console.log(from);
    });

    $scope.tabAction = function(){
      console.log($scope.uiState.tabIconUrl);
      if($scope.uiState.showSidebar){
        if($scope.uiState.showDetailsPanel){
          $scope.uiState.showDetailsPanel = false;
        }
        else{
          $scope.uiState.showSidebar = false;
          //$scope.uiState.tabIconUrl = arrowLeftIconURL;
          $("#arrow-icon").attr("src", arrowLeftIconURL);
        }
      }
      else{
        $scope.uiState.showSidebar = true;
        $("#arrow-icon").attr("src", arrowRightIconURL);

      }
    }
  }]);



/***************************************************************************
/
/ Manually Bootstraps angular app by calling this function
/
/***************************************************************************/

var bootstrapApp = function(){

	var appRoot = $('#injected-content');
	if(appRoot){

		/* Manually bootstrap the Angular app */
		window.name = '';   // To allow `bootstrap()` to continue normally
		angular.bootstrap(appRoot, ['sidebarDatingExt']);
		console.log('Boot and loaded !');

	}
}
