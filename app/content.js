
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
  uiStateService.isSelected = -1;
  uiStateService.selectedProfile = false;
  uiStateService.showSidebar = true;
  uiStateService.showDetailsPanel = false;
  uiStateService.selfUserId = 1;//0 for static data 
  uiStateService.selfProfile = false;
  uiStateService.dancecard = {};

  return uiStateService;
});

/*******************************************************************************************************
Message Service  */

appServices.factory('MessageService', ['$http', 'UiState',
  function($http, UiState){
  
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
          url: "http://localhost:3000/message/" + userid + "/?userId=" + UiState.selfUserId
        }).
        success(function(data, status, headers, config){
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log('error getting static json file');
        }); 
      }

      messageService.sendMessageTouserid = function(message, callback){
        $http({
          method: 'POST',
          url: "http://localhost:3000/message/",
          data: message
        }).
        success(function(data, status, headers, config){
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log('error posting message');
        }); 
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
          angular.copy(data, dancecardService.dancecard);
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log('error getting static json file');
        }); 
      }

      dancecardService.getDancecard = function(callback){
        $http({
          method: 'GET',
          url: "http://localhost:3000/dancecard/"+UiState.selfUserId
        })
        .success(function(data, status, headers, config){
            angular.copy(data, dancecardService.dancecard);
            callback(data);
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
            callback(data);
        }).
        error(function(data, status, headers, config){
          console.log('error posting data: add dancecard failed');
        }); 
      }

  return dancecardService;
}]);

/*******************************************************************************************************
Profile Service  */

appServices.factory('Profile', ['$resource', '$http',
  function($resource, $http){

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
        callback(data);
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
        callback(data);   // this callback will be called asynchronously when the response is available
      }).
      error(function(data, status, headers, config) {
        console.log('get people failure');
      });
    }

    return profileFactory;

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
Sign-up Controller  */

appControllers.controller('SignupCtrl', ['$scope', '$state', 'UiState',
  function($scope, $state, UiState) {

    $scope.beginSignup = function(){
        $state.go('sign-up-1');
    }

    $scope.goToSignupStep2 = function(){
        $state.go('sign-up-2');
    }

    $scope.goToSignupStep2 = function(){
        $state.go('sign-up-3');
    }

    $scope.createAccount = function(){
       // $state.go('main.profileList');
       $state.go('main.profileList', { reload: true, inherit: false, notify: false});
    }

}]);

/*******************************************************************************************************
Message Controller  */

appControllers.controller('MessageCtrl', ['$scope', 'UiState', 'MessageService',
  function($scope, UiState, MessageService) {

    $scope.messageThread = $scope.conversation;//inherited from DanceCardCtrl
    $scope.newMessage;

    console.log($scope.conversation);
    $scope.ifSentByUser = function(i){
      if($scope.conversation[i].senderid ==  UiState.selfUserId){
        return true;
      }
      else{
        return false;
      }
    }

    $scope.sendMessage = function(){

      if($scope.newMessage){
        var message = {
          senderid: UiState.selfUserId,
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

appControllers.controller('DanceCardCtrl', ['$rootScope','$scope', '$state', 'UiState', 'MessageService', 'DancecardService',
  function($rootScope, $scope, $state, UiState, MessageService, DancecardService) {
    
    // DancecardService.getStaticDancecard(function(data){
    //     $scope.danceCard = data;
    // });

    $scope.username = UiState.selfProfile.username;

    $scope.$on('username-available', function(event){
      console.log('Dancecard was updated! ');
      console.log(event);
      $scope.username = UiState.selfProfile.username;
    });

    DancecardService.getDancecard(function(data){
        $scope.dancecard = data;
        UiState.dancecard = $scope.dancecard;
    });

    $scope.$on('dancecard-update', function(event){
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
        });
        //console.log($scope.conversation);
      }

      $scope.showDetailedProfile = function(){
        UiState.isSelected = $scope.selectedProfile.userid; 
        UiState.showDetailsPanel = true;
      }

      $scope.ifSelected = function(){
        return (UiState.selectedProfile.userid == $scope.selectedProfile.userid && $scope.selectedProfile != -1);
      }

    $scope.conversation = false;
    $scope.showShortProfile = false;
    $scope.selectedProfile = -1;

  }]);

/*******************************************************************************************************
Profile List Controller  */

appControllers.controller('ProfileListCtrl', ['$scope', 'Profile', 'UiState',
  function($scope, Profile, UiState) {

    //Profile.getStaticProfileList(function(data){
    Profile.getProfilesByPage("someUrl", UiState.selfUserId, function(data){
      $scope.profiles = data;
    });

    $scope.selectOnly = function(i){
      UiState.showDetailsPanel = true;
      UiState.selectedProfile = $scope.profiles[i];
    }

    $scope.ifSelected = function(i){
      return (UiState.showDetailsPanel && UiState.selectedProfile.userid == $scope.profiles[i].userid);
    }

    $scope.orderProp = 'relevance';

  }]);

/*******************************************************************************************************
Profile Detail Controller  */

appControllers.controller('ProfileDetailCtrl', ['$rootScope', '$scope', 'Profile', 'UiState','DancecardService',
  function($rootScope, $scope, Profile, UiState, DancecardService) {


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
      return (UiState.selectedProfile.userid == UiState.selfUserId);
    }

    $scope.updateDancecard = function(userid, status){
      var data = {
        userid: UiState.selfUserId,
        partnerid: userid,
        status: status
      }
      if(status == 'added' && UiState.dancecard.length < 5){
        DancecardService.updateDancecard(data, function(result){
            UiState.dancecard = result;
            if(status == 'removed'){
              UiState.selectedProfile = UiState.selfProfile;
            }
            $rootScope.$broadcast('dancecard-update');
        });
      }
      else{
        console.log('You dancecard is filled! You must remove someone to add again');
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

    Profile.getProfilesByPage("someUrl", UiState.selfUserId, function(data){
      // console.log('in uicontroler: pageProfiles');
      // console.log(data);
      $scope.uiState.pageProfiles = data;
    });

    Profile.getProfileById(UiState.selfUserId, function(data){

      $scope.uiState.selfProfile = data[0];
      $scope.uiState.selectedProfile = data[0];
      $rootScope.$broadcast('username-available');
      // console.log('in uicontroler: self profile');
      // console.log($scope.uiState.selectedProfile);
    });

    DancecardService.getDancecard(function(data){
      // console.log('in uicontroler: dancecard');
      // console.log(data);
      $scope.uiState.dancecard = data;
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
