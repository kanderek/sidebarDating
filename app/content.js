
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

        .state('main.profileList', {
          url: '',
          templateUrl: chrome.extension.getURL('partials/profileList.html'),
            controller: 'ProfileListCtrl'
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

  uiStateService.pageProfiles = {};
  uiStateService.selectedProfile = {};
  //uiStateService.selfUserId;//0 for static data 
  uiStateService.selfProfile = {};
  uiStateService.dancecard = {};

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

appServices.factory('MessageService', ['$http', '$state', 'UiState', 
  function($http, $state, UiState){
  
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
          url: "http://localhost:3000/message/" + userid + "/?userId=" + UiState.selfProfile.userid
        }).
        success(function(data, status, headers, config){
            if(data.status != "logged_out"){
               callback(data);  
            }
            else{
              $state.go('sign-up-0');
            }
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
            if(data.status != "logged_out"){
               callback(data);  
            }
            else{
              $state.go('sign-up-0');
            }
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
Dancecard Service  */

appServices.factory('DancecardService', ['$rootScope', '$http', 'UiState',
  function($rootScope, $http, UiState){
  
  var dancecardService = {};

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
            if(data.status != "logged_out"){
               callback(data);  
            }
            else{
              $state.go('sign-up-0');
            }
        }).
        error(function(data, status, headers, config){
          console.log('error getting dancecard');
        }); 
      }

      dancecardService.updateDancecard = function(data, callback){
        $http({
          method: 'POST',
          url: "http://localhost:3000/dancecard",
          data: data
        }).
        success(function(data, status, headers, config){
            if(data.status != "logged_out"){
               callback(data);  
            }
            else{
              $state.go('sign-up-0');
            }
        }).
        error(function(data, status, headers, config){
          console.log('error posting data: add dancecard failed');
        }); 
      }

  return dancecardService;
}]);

/*******************************************************************************************************
Profile Service  */

appServices.factory('Profile', ['$resource', '$http', '$state',
  function($resource, $http, $state){

    var profileFactory = {};

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
        if(data.status != "logged_out"){
           callback(data);  
        }
        else{
            $state.go('sign-up-0');
        }
      }).
      error(function(data, status, headers, config){
        console.log('error getting user profile ' + userid);
      }); 
    }

    profileFactory.getProfilesByInterest = function(userid, callback){
    }

    profileFactory.getProfilesByPage = function(url, userid, callback){
       $http({
          method: 'GET', 
          url: 'http://localhost:3000/crowd/?url=' + url + "&userid=" + userid
        }).
      success(function(data, status, headers, config) {
        if(data.status != "logged_out"){
           callback(data);   // this callback will be called asynchronously when the response is available
        }
        else{
          $state.go('sign-up-0');
        }
      }).
      error(function(data, status, headers, config) {
        console.log('get people failure');
      });
    }

    return profileFactory;

  }]);

/*******************************************************************************************************
Signup Service  */

appServices.factory('SignupService', ['$http',
  function($http){

    var signupService = {};

    signupService.user = {};
    signupService.pref = {};

    signupService.signupUser = function(callback){
      $http({
        method: 'POST',
        url: "http://localhost:3000/signup",
        data: {user: this.user, pref: this.pref}
      }).
      success(function(data, status, headers, config){
        callback(data);
      }).
      error(function(data, status, headers, config){
        console.log('error signing up user: sending data to server failed');
      }); 
    }

    return signupService;

  }]);

/*******************************************************************************************************
Login Service  */

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

appServices.factory('InitService', ['$rootScope', 'UiState','Profile','DancecardService',
  function($rootScope, UiState, Profile, DancecardService){

         var initService = {};

         initService.initializeData = function(userid){

            // UiState.selfProfile.userid = userid;

            Profile.getProfileById(userid, function(data){

              UiState.selfProfile = data[0];
              UiState.selectedProfile = data[0];
              $rootScope.$broadcast('username-available');

            });

            Profile.getProfilesByPage("someUrl", userid, function(data){

              UiState.pageProfiles = data;
              $rootScope.$broadcast('page-profiles-available');
            });

            DancecardService.getDancecardById(userid, function(data){

              UiState.dancecard = data;
              $rootScope.$broadcast('dancecard-available');
            });
          };

          initService.initializeDataOnSignup = function(user){

            // UiState.selfProfile.userid = user.userid;
            UiState.selfProfile = user;
            UiState.selectedProfile = user;
            $rootScope.$broadcast('username-available');

            Profile.getProfilesByPage("someUrl", user.userid, function(data){

              UiState.pageProfiles = data;
              $rootScope.$broadcast('page-profiles-available');
            });

            DancecardService.getDancecardById(user.userid, function(data){

              UiState.dancecard = data;
              $rootScope.$broadcast('dancecard-available');
            });
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
          InitService.initializeDataOnSignup(data.user);
       });
       $state.go('main.profileList', { reload: true, inherit: false, notify: false});
    }

}]);

/*******************************************************************************************************
Login Controller  */

appControllers.controller('LoginCtrl', ['$scope', '$rootScope', '$state','UiState', 'LoginService', 'Profile', 'DancecardService', 'InitService',
  function($scope, $rootScope, $state, UiState, LoginService, Profile, DancecardService, InitService) {

    $scope.email;
    $scope.password;
    $scope.uiState = UiState;

    console.log(url_info);
    $scope.login = function(){
            LoginService.loginUser({email: $scope.email, password: $scope.password}, function(data){
            if(data){ 
              console.log('data returned from login process');
              console.log(data);
              console.log('User should be logged in...');

              InitService.initializeData(data.userid);

            $state.go('main.profileList', {reload: true, inherit: false, notify: false});
          }
        });
    }

  }]);


/*******************************************************************************************************
Message Controller  */

appControllers.controller('MessageCtrl', ['$scope', '$timeout', '$state', 'UiState', 'MessageService', 'Socket',
  function($scope, $timeout, $state, UiState, MessageService, Socket) {

    // Socket.on('init', function(data){
    //   console.log('connection started...');
    //   console.log('socket id: ');
    //   console.log(data.socketid);

    //   Socket.emit('register-user', {userid: UiState.selfProfile.userid}, function(){});
    // });

    // Socket.on('new-message', function(data){
    //   console.log('new messsage received...');
    //   console.log(data);
    //   $scope.messageThread.push(data);
    // });
    


    $scope.messageThread = $scope.conversation;//inherited from DanceCardCtrl
    $scope.newMessage;

    console.log($scope.conversation);
    $scope.ifSentByUser = function(i){
      if($scope.conversation[i].senderid ==  UiState.selfProfile.userid){
        return true;
      }
      else{
        return false;
      }
    }

    $scope.sendMessage = function(){

      if($scope.newMessage){
        var message = {
          senderid: UiState.selfProfile.userid,
          receiverid: UiState.selectedProfile.userid,
          message: $scope.newMessage,
        }
        $scope.conversation.push(message);
        MessageService.sendMessageTouserid(message, function(data){
          //post response data?
          console.log('post of message a success');
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
Dancecard Controller  */

appControllers.controller('DanceCardCtrl', ['$rootScope','$scope', '$timeout', '$state', 'UiState', 'MessageService', 'DancecardService', 'Socket',
  function($rootScope, $scope, $timeout, $state, UiState, MessageService, DancecardService, Socket) {
    
    // DancecardService.getStaticDancecard(function(data){
    //     $scope.danceCard = data;
    // });
  
    // console.log("Uistate in dancecard controller...");
    // console.log(UiState);
    Socket.on('init', function(data){
      console.log('connection started...');
      console.log('socket id: ');
      console.log(data.socketid);

      Socket.emit('register-user', {userid: UiState.selfProfile.userid}, function(){});
    });

    Socket.on('new-message', function(data){
      console.log('new messsage received...');
      console.log(data);
      $scope.conversation.push(data);
    });


    $scope.username = UiState.selfProfile.username;

    $scope.$on('username-available', function(event){
      console.log('username is ready to render! ');
      console.log(event);
      $scope.username = UiState.selfProfile.username;
    });

    // DancecardService.getDancecard(UiState.selfProfile.userid, function(data){
    //     $scope.dancecard = data;
    //     for(var i=0; i < (5 - data.length); i++){
    //       $scope.dancecard_open 
    //     }
    //     UiState.dancecard = $scope.dancecard;
    // });

    $scope.$on('dancecard-update', function(event){
      // console.log('Dancecard was updated! ');
      // console.log(event);
      $scope.dancecard = UiState.dancecard;
    });

     $scope.$on('dancecard-available', function(event){
      // console.log('Dancecard was updated! ');
      // console.log(event);
      $scope.dancecard = UiState.dancecard;
    });

    $scope.goToProfile = function(){
      if(UiState.selectedProfile != UiState.selfProfile){
        $scope.uiState.selectedProfile = $scope.uiState.selfProfile;
      }
      UiState.showDetailsPanel = true;
    }

    $scope.selectOnly = function(i){
        UiState.selectedProfile = $scope.dancecard[i];
        $scope.selectedProfile = $scope.dancecard[i];
        $scope.showShortProfile = true;
        $state.go('main.messages');
        //MessageService.getMessageByuserid(UiState.selectedProfile.userid);
        getConversation(UiState.selectedProfile.userid);
      }

      var getConversation = function(userid){
        // MessageService.getStaticMessageByuserid(userid, function(data){
        //   $scope.conversation = data;
        // });
        MessageService.getMessageByuserid(userid, function(data){
          $scope.conversation = data;
          console.log('in dcc after message fetch')
          console.log($scope.conversation);
        });
        console.log('in dcc outside of callback');
        console.log($scope.conversation);
      }

      $scope.showDetailedProfile = function(){
        UiState.isSelected = $scope.selectedProfile.userid; 
        UiState.showDetailsPanel = true;
      }

      $scope.ifSelected = function(){
        return (UiState.selectedProfile.userid == $scope.selectedProfile.userid && $scope.selectedProfile != -1);
      }

    $scope.conversation = [];
    $scope.showShortProfile = false;
    $scope.selectedProfile = -1;

  }]);

/*******************************************************************************************************
Profile List Controller  */

appControllers.controller('ProfileListCtrl', ['$scope', 'Profile', 'UiState',
  function($scope, Profile, UiState) {

    // console.log("Uistate in profile List controller...");
    // console.log(UiState);
    //Profile.getStaticProfileList(function(data){
    // Profile.getProfilesByPage("someUrl", UiState.selfProfile.userid, function(data){
    //   $scope.profiles = data;
    // });
    $scope.profiles = UiState.pageProfiles;
    
    $scope.$on('dancecard-available', function(event){
      // console.log('Dancecard was updated! ');
      // console.log(event);
      $scope.profiles = UiState.pageProfiles;
    });

    $scope.selectOnly = function(i){
      UiState.showDetailsPanel = true;
      UiState.selectedProfile = $scope.profiles[i];
    }

    $scope.ifSelected = function(i){
      return (UiState.showDetailsPanel && UiState.selectedProfile.userid == $scope.profiles[i].userid);
    }

    // $scope.orderProp = 'username'; does not sort UiState.pageProfiles so indexes are out of sync, don't use for now.

  }]);

/*******************************************************************************************************
Profile Detail Controller  */

appControllers.controller('ProfileDetailCtrl', ['$rootScope', '$scope', '$state', 'Profile', 'UiState','DancecardService',
  function($rootScope, $scope, $state, Profile, UiState, DancecardService) {

    // $scope.profileImages = [
    //           {
    //              imageurl: "http://lorempixel.com/400/300/people/1",
    //              label: 1
    //           },
    //           {
    //               imageurl:  "http://lorempixel.com/400/300/people/2",
    //               label: 2
    //           },
    //           {
    //               imageurl:  "http://lorempixel.com/400/300/people/3",
    //               label: 3
    //           }
    //         ];

    // console.log('in profileDetails controller....');
    // console.log(UiState);
    // console.log($scope.uiState);

    $scope.uiState = UiState;
    $scope.profileImages = UiState.selectedProfile.imageurls;
    console.log('in profile details controller...');
    console.log(UiState);
    console.log(UiState.selectedProfile);
    console.log($scope.profileImages);
    console.log(UiState.selectedProfile.imageurls);

    $scope.showAddButton = function(){
      return (!$scope.isInDanceCard(UiState.selectedProfile.userid) && !$scope.isSelf());
    }

    $scope.showRemoveButton = function(){
      return ($scope.isInDanceCard(UiState.selectedProfile.userid) && !$scope.isSelf());
    }

    $scope.isInDanceCard = function(userid){
      // console.log("isInDanceCard?  ");
      // console.log(UiState.dancecard);
      // console.log(userid);
      for(var i=0; i<UiState.dancecard.length; i++) {
        if(UiState.dancecard[i].userid == userid){
          return true;
        }
      };
      return false; 
    };

    $scope.isSelf = function(){
      return (UiState.selectedProfile.userid == UiState.selfProfile.userid);
    }

    $scope.updateDancecard = function(userid, status){
      var data = {
        userid: UiState.selfProfile.userid,
        partnerid: userid,
        status: status
      }
      if(status == 'added'){
        if(UiState.dancecard.length < 5){
          DancecardService.updateDancecard(data, function(result){
              UiState.dancecard = result;
              $rootScope.$broadcast('dancecard-update');
          });
        }
        else {
          console.log('Your dancecard is filled! You must remove someone to add again');
        }
      }

      if(status == 'removed'){
          DancecardService.updateDancecard(data, function(result){
            UiState.dancecard = result;
            UiState.selectedProfile = UiState.selfProfile;
            UiState.showDetailsPanel = false;
            $rootScope.$broadcast('dancecard-update');
            $state.go('main.profileList');
          });
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
