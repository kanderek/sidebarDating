
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


'use strict';

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
        .state('main', {
          views: {   
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/danceCardMenu.html'),
                controller: 'DanceCardCtrl'
              },
              'detailsPanel': {
                templateUrl: chrome.extension.getURL('partials/profileDetails.html'),
                controller: 'ProfileListCtrl'
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

        .state('main.sidebar', {
                url: '',
              controller: '',
              templateUrl: chrome.extension.getURL('partials/profileSelf.html')
        });
  }]);

/* Services */

var appServices = angular.module('appServices', ['ngResource']);

appServices.factory('UiState', function(){
  var uiStateService = {};

  uiStateService.isSelected = -1;
  uiStateService.selectedProfile = false;
  uiStateService.showSidebar = true;
  uiStateService.showDetailsPanel = false;

  return uiStateService;
});

appServices.factory('MessageService', ['$http', 
  function($http){
  
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

  return messageService;
}]);

appServices.factory('DancecardService', ['$http', 
  function($http){
  
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

  return dancecardService;
}]);


appServices.factory('Profile', ['$resource', '$http',
  function($resource, $http){

    var profileFactory = {}

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
    }

    profileFactory.getPeopleByInterest = function(userid, callback){
    }

    profileFactory.getPeopleOnPage = function(url, callback){
       $http({
          method: 'GET', 
          url: 'http://localhost:3000/crowd/?url=' + url
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

/* Controllers */

var appControllers = angular.module('appControllers', []);

appControllers.controller('MessageCtrl', ['$scope', 'UiState', 'MessageService',
  function($scope, UiState, MessageService) {

    $scope.messageThread = $scope.conversation;//inherited from DanceCardCtrl

    $scope.newMessage;

    $scope.ifSentByUser = function(i){
      if($scope.conversation[i].senderId == 0){

        return true;
      }
      else{
        return false;
      }
    }

    $scope.sendMessage = function(){

      if($scope.newMessage){
        var message = {
          senderId: 0,
          message: $scope.newMessage,
          timeStamp: "just now"
        }

        $scope.conversation.push(message);
        $scope.newMessage = "";
      }
    }

    $scope.$watch(function () {
       return document.getElementById("messages").innerHTML;
    }, function(val) {
      scrollToBottom();
       //TODO: write code here, slit wrists, etc. etc.
    });

    var scrollToBottom = function(){
      var element = $('#messages')[0];
      console.log(element.scrollHeight);
        
      if( (element.offsetHeight < element.scrollHeight)){
     // your element have overflow
        //element.style.background = "yellow";
      var valueToScroll = element.scrollHeight;//element.scrollHeight - element.offsetHeight;
      $("#messages").scrollTop(valueToScroll);
      //$("messages").animate({ scrollTop: valueToScroll }, { duration: 200 } );
      }
      else{
        //your element don't have overflow
      }
    }

  }]);

appControllers.controller('DanceCardCtrl', ['$scope', '$state', 'UiState', 'MessageService', 'DancecardService',
  function($scope, $state, UiState, MessageService, DancecardService) {
    
    DancecardService.getStaticDancecard(function(data){
        $scope.danceCard = data;
    });

    $scope.selectOnly = function(i){
        UiState.selectedProfile = $scope.danceCard[i];
        $scope.selectedProfile = $scope.danceCard[i];
        $scope.showShortProfile = true;
        $state.go('main.messages');
        //MessageService.getMessageByuserid(UiState.selectedProfile.userid);
        getConversation(UiState.selectedProfile.userid);
      }

      var getConversation = function(userid){

        MessageService.getStaticMessageByuserid(userid, function(data){
          $scope.conversation = data;
        });
        console.log($scope.conversation);
      }

      $scope.showDetailedProfile = function(){
        UiState.isSelected = $scope.selectedProfile.userid; 
        UiState.showDetailsPanel = true;
      }

      $scope.ifSelected = function(){
      
        if(UiState.selectedProfile.userid == $scope.selectedProfile.userid && $scope.selectedProfile != -1){
          return true;
        }
        else{
          return false;
        }
      }

      $scope.conversation = false;
    $scope.showShortProfile = false;
    $scope.selectedProfile = -1;
  }]);

appControllers.controller('ProfileListCtrl', ['$scope', 'Profile', 'UiState',
  function($scope, Profile, UiState) {

    //$scope.profiles = Profile.query();
    Profile.getStaticProfileList(function(data){
    //Profile.getPeopleOnPage("someUrl", function(data){
      $scope.profiles = data;
    });
    console.log($scope.profiles);

    $scope.selectOnly = function(i){
      UiState.showDetailsPanel = true;
      UiState.selectedProfile = $scope.profiles[i];
    }

    $scope.ifSelected = function(i){
      
      if(UiState.showDetailsPanel && UiState.selectedProfile.userid == $scope.profiles[i].userid){
        return true;
      }
      else{
        return false;
      }
    }

    $scope.orderProp = 'relevance';

  }]);

appControllers.controller('uiCtrl', ['$scope', 'UiState', 
  function($scope, UiState){
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

appControllers.controller('ProfileDetailCtrl', ['$scope', '$stateParams', 'Profile',
  function($scope, $stateParams, Profile) {
    // $scope.profile = Profile.get({profileId: $routeParams.profileId}, function(profile) {
    //   $scope.mainImageUrl = profile.images[0];
    // });

    // $scope.setImage = function(imageUrl) {
    //   $scope.mainImageUrl = imageUrl;
    // }


    //$scope.profile =Profile.query()[index];

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
