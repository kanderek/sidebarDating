var appServices = angular.module('appServices', []).value('version', '0.1');

/*******************************************************************************************************
Ui State Service  */

// appServices.factory('UiState', function(){

//   var uiStateService = {};

//   // uiStateService.pageProfiles = {};
//   // uiStateService.selectedProfile = {};
//   // uiStateService.selfProfile = {};

//   //uiStateService.selfUserId;//0 for static data 

//   // uiStateService.dancecard = {};

//   uiStateService.previousState;
//   uiStateService.showSidebar = true;
//   uiStateService.showDetailsPanel = false;

//   return uiStateService;
// });

// /*******************************************************************************************************
// Socket IO Wrapper Service  */


// appServices.factory('Socket', function ($rootScope) {
//   var socket = io.connect('http://localhost:3000');
//   return {
//     on: function (eventName, callback) {
//       socket.on(eventName, function () {  
//         var args = arguments;
//         $rootScope.$apply(function () {
//           callback.apply(socket, args);
//         });
//       });
//     },
//     emit: function (eventName, data, callback) {
//       socket.emit(eventName, data, function () {
//         var args = arguments;
//         $rootScope.$apply(function () {
//           if (callback) {
//             callback.apply(socket, args);
//           }
//         });
//       })
//     }
//   };
// });

/*******************************************************************************************************
Message Service  */

// appServices.factory('MessageService', ['$http', '$state', 'Profile', 
//   function($http, $state, Profile){
  
//   var messageService = {};

//       messageService.getStaticMessages = function(callback){
//         $http({
//           method: 'GET',
//           url: chrome.extension.getURL("staticData/messages.json")
//         }).
//         success(function(data, status, headers, config){
//           callback(data);
//         }).
//         error(function(data, status, headers, config){
//           console.log('error getting static json file');
//         }); 
//       }

//       messageService.getStaticMessageByuserid = function(userid, callback){
//         $http({
//           method: 'GET',
//           url: chrome.extension.getURL("staticData/message_user" + userid + ".json")
//         }).
//         success(function(data, status, headers, config){
//           callback(data);
//         }).
//         error(function(data, status, headers, config){
//           console.log('error getting static json file');
//         }); 
//       }

//       messageService.getMessageByuserid = function(userid, callback){
//         $http({
//           method: 'GET',
//           url: "http://localhost:3000/message/" + userid + "/?userId=" + Profile.selfProfile.userid
//         }).
//         success(function(data, status, headers, config){
//             // if(data.status != "logged_out"){
//                callback(data);  
//             // }
//             // else{
//             //   $state.go('sign-up-0');
//             // }
//         }).
//         error(function(data, status, headers, config){
//           console.log('error getting static json file');
//         }); 
//       }

//       messageService.sendMessageTouserid = function(message, callback){
//         if(message.senderid != message.receiverid){
//           $http({
//             method: 'POST',
//             url: "http://localhost:3000/message/",
//             data: message
//           }).
//           success(function(data, status, headers, config){
//             // if(data.status != "logged_out"){
//                callback(data);  
//             // }
//             // else{
//             //   $state.go('sign-up-0');
//             // }
//           }).
//           error(function(data, status, headers, config){
//             console.log('error posting message');
//           }); 
//         }
//         else{
//           console.log('Cannot send message to yourself');
//         }
//       }

//   return messageService;
// }]);

// /*******************************************************************************************************
// Notification Service  */

// appServices.factory('NotificationService', ['$http', '$state', 'Profile', 
//   function($http, $state, Profile){
  
//   var notificationService = {};
//       /*
//             notificationid  SERIAL,
//             userid      int REFERENCES users (userid) ON DELETE CASCADE,
//             message     varchar(140) NOT NULL,  
//             action_time   timestamp,
//             type      varchar(50),--message/dancecard
//             status      varchar(50),--read/unread/ignore
//       */

//       notificationService.notifications = [];
//       notificationService.unreadCount = 0;

//       notificationService.getUnreadCount = function(){
          
//           notificationService.unreadCount = 0;
//           for(var i=0; i<notificationService.notifications.length; i++){
//             if(notificationService.notifications[i].status == "unread"){
//               notificationService.unreadCount += 1;
//             }
//           }
//           return notificationService.unreadCount;
//       }

//       notificationService.markRead = function(index){
//         if(notificationService.notifications[index].status == 'unread'){
//           notificationService.unreadCount--;
//           notificationService.notifications[index].status = 'read';
//           notificationService.updateNotificationStatus({
//                 notification: {
//                   status: notificationService.notifications[index].status,
//                   notificationid: notificationService.notifications[index].notificationid
//                 }
//               });
//         }
//       }

//       notificationService.addNotification = function(notification){
//           notificationService.notifications.unshift(notification);
//           notificationService.unreadCount++;
//       }

//       notificationService.initializeNotifications = function(userid){
//         notificationService.getNotifications(userid);
//       }

//       notificationService.getNotifications = function(userid){
//         $http({
//           method: 'GET',
//           url: "http://localhost:3000/notifications/" + userid
//         }).
//         success(function(data, status, headers, config){
//             // if(data.status != "logged_out"){
//                // callback(data); 
//                console.log(data);
//                notificationService.notifications = data;
//                notificationService.getUnreadCount()
//             // }
//             // else{
//             //   $state.go('sign-up-0');
//             // }
//         }).
//         error(function(data, status, headers, config){
//           console.log('error getting static json file');
//         }); 
//       }

//       notificationService.updateNotificationStatus = function(data){
//           $http({
//             method: 'POST',
//             url: "http://localhost:3000/notifications/",
//             data: data
//           }).
//           success(function(data, status, headers, config){
//                // callback(data);
//                //update

//           }).
//           error(function(data, status, headers, config){
//             console.log('error posting message');
//           }); 
//         }

//   return notificationService;
// }]);


// /*******************************************************************************************************
// Dancecard Service  */

// appServices.factory('DancecardService', ['$rootScope', '$http', 'Profile',
//   function($rootScope, $http, Profile){
  
//   function fillBlankDancecardSpots(){
//      var curDancecardLength = dancecardService.dancecard.length;
//      for(var i=0; i<(5-curDancecardLength); i++){
//        dancecardService.dancecard.push({smallimageurls: ['http://localhost:3000/user/user.png'], userid: -1}); 
//      }
//   }

//   function getNumberFreeDancecardSpots(){
//       var count = 0;
//       for(var i=0; i<5; i++){
//         if(dancecardService.dancecard[i].userid == -1){
//           count++;
//         }
//       } 
//       return count;
//     }

//   var dancecardService = {};

//       dancecardService.dancecard = [];
//       dancecardService.interestedPeople = [];

//       dancecardService.getStaticDancecard = function(callback){
//         $http({
//           method: 'GET',
//           url: chrome.extension.getURL("staticData/dancecard.json")
//         }).
//         success(function(data, status, headers, config){
//           callback(data);
//         }).
//         error(function(data, status, headers, config){
//           console.log('error getting static json file');
//         }); 
//       }

//       dancecardService.isDancecardFilled = function(){
//         return (getNumberFreeDancecardSpots() <= 0);
//       }

//       dancecardService.initializeDancecard = function(userid){
//         dancecardService.dancecard = [];
//         dancecardService.interestedPeople = [];
//         dancecardService.getDancecardById(userid, function(data){});
//         dancecardService.getInterestedPeopleById(userid);
//       }

//       dancecardService.addInterestedPerson = function(userid){
//         dancecardService.interestedPeople.push({userid: parseInt(userid)});
//         console.log('people interested in you by id...');
//         console.log(dancecardService.interestedPeople);
//       }

//       dancecardService.noLongerInterested = function(userid){
//         for(var i=0; i<dancecardService.dancecard.length; i++){
//           if(dancecardService.dancecard[i].userid == userid){
//             dancecardService.dancecard[i].mutual = false;
//             return;
//           }
//         }

//         for(var i=0; i<dancecardService.interestedPeople.length;i++){
//           if(dancecardService.interestedPeople[i] == userid){
//             dancecardService.interestedPeople.splice(i, 1);
//             break;
//           }
//         }
//       }

//       dancecardService.hadAddedYou = function(userid){
//         for(var i=0; i<dancecardService.interestedPeople.length; i++){
//           if ( dancecardService.interestedPeople[i].userid == userid ){
//             return true;
//           }
//         }
//         return false;
//       }

//       dancecardService.setMutual = function(userid){
//         for(var i=0; i<dancecardService.dancecard.length; i++){
//           if(dancecardService.dancecard[i].userid == userid){
//             dancecardService.dancecard[i].mutual = true;
//             break;
//           }
//         }
//       } 

//       dancecardService.getInterestedPeopleById = function(userid){
//         // console.log('in dancecard service...');
//         // console.log(UiState);
//         // console.log(UiState.selfProfile.userid);
//         // console.log(UiState.selfProfile.userid);
//         $http({
//           method: 'GET',
//           url: "http://localhost:3000/dancecard/interested/"+userid
//         })
//         .success(function(data, status, headers, config){
//             // if(data.status != "logged_out"){
//                dancecardService.interestedPeople  = data;
//                //callback(data);
               
//             // }
//             // else{
//             //   $state.go('sign-up-0');
//             // }
//         }).
//         error(function(data, status, headers, config){
//           console.log('error getting dancecard');
//         }); 
//       }

//       dancecardService.getDancecardById = function(userid, callback){
//         // console.log('in dancecard service...');
//         // console.log(UiState);
//         // console.log(UiState.selfProfile.userid);
//         // console.log(UiState.selfProfile.userid);
//         $http({
//           method: 'GET',
//           url: "http://localhost:3000/dancecard/"+userid
//         })
//         .success(function(data, status, headers, config){
//             // if(data.status != "logged_out"){
//                dancecardService.dancecard = data;
//                fillBlankDancecardSpots();
//                $rootScope.$broadcast('dancecard-available');
//                //callback(data);
               
//             // }
//             // else{
//             //   $state.go('sign-up-0');
//             // }
//         }).
//         error(function(data, status, headers, config){
//           console.log('error getting dancecard');
//         }); 
//       }

//       // dancecardService.updateDancecard = function(postData, profileData, callback){
//         dancecardService.updateDancecard = function(postData, profileData){

//         for(var i=0; i<5; i++){
//           if(postData.status == 'added'){
//             if(dancecardService.dancecard[i].userid == -1){
//               dancecardService.dancecard[i] = profileData;
//               if(dancecardService.hadAddedYou(profileData.userid)){
//                 dancecardService.dancecard[i].mutual = 'true';
//               }
//               $rootScope.$broadcast('dancecard-update');
//               dancecardService.postDancecardUpdate(postData, function(data){
//                 console.log('in dancecard service : changed happened...');
//                 console.log(data);
//                 Profile.removeFromPageProfiles(profileData.userid);
//                 Profile.getProfilesByPage("someurl", 1);
//               })
//               break;
//             }
//           }

//           if(postData.status == 'removed'){
//             if(dancecardService.dancecard[i].userid == profileData.userid){
//               dancecardService.dancecard.splice(i,1);
//               dancecardService.dancecard.push({smallimageurls: ['http://localhost:3000/user/user.png'], userid: -1});
//               $rootScope.$broadcast('dancecard-update');
//               Profile.selectedProfile = Profile.selfProfile;
//               dancecardService.postDancecardUpdate(postData, function(data){
//                 //
//               })
//               break;
//             }
//           }
//         }
//       }

//         dancecardService.postDancecardUpdate = function(postData, callback){

//           $http({
//             method: 'POST',
//             url: "http://localhost:3000/dancecard",
//             data: postData
//           }).
//           success(function(data, status, headers, config){
//               // if(data.status != "logged_out"){
//                  callback(data);

//               // }
//               // else{
//               //   $state.go('sign-up-0');
//               // }
//           }).
//           error(function(data, status, headers, config){
//             console.log('error posting data: add dancecard failed');
//           }); 
//         }
      

//   return dancecardService;
// }]);

// /*******************************************************************************************************
// Profile Service  */

// appServices.factory('Profile', ['$rootScope', '$http', '$state',
//   function($rootScope, $http, $state){

//     var profileFactory = {};

//     profileFactory.pageProfiles = [];
//     profileFactory.selectedProfile = {};
//     profileFactory.selfProfile = {};

//     profileFactory.initializeProfile = function(user, url){
//       if(typeof(user) == 'object'){
//         profileFactory.selfProfile = user;
//         profileFactory.selectedProfile = user;
//         profileFactory.initializePageProfiles(url);
//         $rootScope.$broadcast('user-data-available');
//       }
//       else{
//         profileFactory.getProfileById(user, function(data){
//           profileFactory.selfProfile = data[0];
//           profileFactory.selectedProfile = data[0];
//           profileFactory.getProfilesByPage(url, 10);
//           $rootScope.$broadcast('user-data-available');
//         })
//       }
//     }

//     profileFactory.removeFromPageProfiles = function(userid){
//       for(var i=0; i<profileFactory.pageProfiles.length; i++){
//         if(profileFactory.pageProfiles[i].userid == userid){
//           profileFactory.pageProfiles.splice(i, 1);
//           break;
//         }
//       }
//     }

//     profileFactory.getStaticProfileList = function(callback){
//       $http({
//         method: 'GET',
//         url: chrome.extension.getURL("staticData/profiles.json")
//       }).
//       success(function(data, status, headers, config){
//         callback(data);
//       }).
//       error(function(data, status, headers, config){
//         console.log('error getting static json file');
//       }); 
//     }

//     profileFactory.getProfileById = function(userid, callback){
//       $http({
//         method: 'GET',
//         url: 'http://localhost:3000/profile/'+userid
//       }).
//       success(function(data, status, headers, config){
//         // if(data.status != "logged_out"){
//            callback(data);  
//         // }
//         // else{
//         //     $state.go('sign-up-0');
//         // }
//       }).
//       error(function(data, status, headers, config){
//         console.log('error getting user profile ' + userid);
//       }); 
//     }

//     profileFactory.getProfilesByInterest = function(userid, callback){
//     }

//     profileFactory.getProfilesByPage = function(url, limit){
//        var userid = profileFactory.selfProfile.userid;
//        var queryString = "url=" + url + "&userid=" + userid + "&limit=" +limit;
       
//       if(profileFactory.pageProfiles.length > 0){
//          queryString += "&pageprofiles="; 
//          for(var i=0; i<profileFactory.pageProfiles.length; i++){
//              queryString += profileFactory.pageProfiles[i].userid;
//              if(i != profileFactory.pageProfiles.length -1){
//                 queryString += ',';
//              } 
//          }
//       }

//        $http({
//           method: 'GET', 
//           url: 'http://localhost:3000/crowd/?' + queryString
//         }).
//       success(function(data, status, headers, config) {
//         // if(data.status != "logged_out"){
//            //callback(data);   // this callback will be called asynchronously when the response is available
//           // console.log(data);
//           profileFactory.pageProfiles = profileFactory.pageProfiles.concat(data);
//           $rootScope.$broadcast('page-profiles-available');
//         // }
//         // else{
//         //   $state.go('sign-up-0');
//         // }
//       }).
//       error(function(data, status, headers, config) {
//         console.log('get people failure');
//       });
//     }

//     return profileFactory;

//   }]);

// /*******************************************************************************************************
// Signup Service  */

// appServices.factory('SignupService', ['$http', 'Profile',
//   function($http, Profile){

//     var signupService = {};

//     signupService.user = {};
//     signupService.pref = {};

//     signupService.signupUser = function(callback){
//       $http({
//         method: 'POST',
//         url: "http://localhost:3000/signup",
//         data: {user: this.user, pref: this.pref}
//       }).
//       success(function(data, status, headers, config){
//         // callback(data);
//         Profile.selfProfile = data;
//       }).
//       error(function(data, status, headers, config){
//         console.log('error signing up user: sending data to server failed');
//       }); 
//     }

//     return signupService;

//   }]);

// /*******************************************************************************************************
// Login Service  */

appServices.factory('LoginService', ['$http', 
  function($http){

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

// /*******************************************************************************************************
// Authentication Service  */

// appServices.factory('AuthService', ['$http',
//   function($http){

//     var authService = {};

//     authService.checkUserStatus = function(callback){
//       $http({
//         method: 'GET',
//         url: "http://localhost:3000/authentication_status"
//       }).
//       success(function(data, status, headers, config){
//         callback(data);
//       }).
//       error(function(data, status, headers, config){
//         console.log('error logging in user');
//       }); 
//     }

//     return authService;

//   }]);

// /*******************************************************************************************************
// Init Service  */

// appServices.factory('InitService', ['$rootScope', 'UiState','Profile','DancecardService', 'Socket', 'NotificationService',
//   function($rootScope, UiState, Profile, DancecardService, Socket, NotificationService){

//          var initService = {};

//          initService.initializeData = function(user){

//             Profile.initializeProfile(user, "someurl");

//             var userid = typeof(user) == 'object' ? user.userid : user;

//             DancecardService.initializeDancecard(userid);
//             NotificationService.initializeNotifications(userid);
//             Socket.emit('register-user', {userid: userid}, function(){});            
//           };

//           return initService;
//   }]);