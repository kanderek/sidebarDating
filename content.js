

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

/* Angular-specific code goes here (i.e. defining and configuring
 * modules, directives, services, filters, etc.) */

var sidebarApp = angular.module('sidebarDatingExt',[
    'ui.router',
	'ngRoute',
	'appControllers',
	'appServices'
]);


sidebarApp.config(['$urlRouterProvider', '$sceDelegateProvider', '$stateProvider', '$sceProvider',
  function($urlRouterProvider, $sceDelegateProvider, $stateProvider, $sceProvider) {

  	$sceProvider.enabled(false);

  	$sceDelegateProvider.resourceUrlWhitelist([
	    // Allow same origin resource loads.
	    'self',
	    // Allow loading from outer templates domain.
	    'chrome-extension://*/partials/**'
	  ]); 

    //$urlRouterProvider.otherwise('/');

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
			templateUrl: chrome.extension.getURL('partials/messages.html'),
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

appServices.factory('MessageService', function(){
	
	var messageService = {};

	messageService.messageData = [
			{
				"userId": 15,
				"conversation": [
			        {
			          "senderId": 0,
			          "message": "hello!",
			          "timeStamp": "2 days ago"
			        },
			        {
			          "senderId": 15,
			          "message": "hi",
			          "timeStamp": "2 days ago"
			        },
			        {
			          "senderId": 15,
			          "message": "how are you? Did you have a good day?",
			          "timeStamp": "2 days ago"
			        },
			        {
			          "senderId": 0,
			          "message": "Yeah it was great. Do you want to get some coffee?",
			          "timeStamp": "2 days ago"
			        },
			        {
			          "senderId": 15,
			          "message": "sure, Philz on 18th street?",
			          "timeStamp": "2 days ago"
			        },
			        {
			          "senderId": 0,
			          "message": "sounds good, see you then",
			          "timeStamp": "2 days ago"
			        }
		        ]
		    },
		    {
		    	"userId": 25,
		        "conversation": [
		        	{
			          "senderId": 0,
			          "message": "hello! Sarah",
			          "timeStamp": "2 days ago"
			        },
			        {
			          "senderId": 25,
			          "message": "hi",
			          "timeStamp": "2 days ago"
			        }
		        ]
		    },
		    {
		    	"userId": 35,
		    	"conversation": [
		        	{
			          "senderId": 0,
			          "message": "hello! Phillis",
			          "timeStamp": "2 days ago"
			        },
			        {
			          "senderId": 35,
			          "message": "hi",
			          "timeStamp": "2 days ago"
			        }
		        ]
		    },
		    {
		    	"userId": 45,
		    	"conversation": [
		        	{
			          "senderId": 0,
			          "message": "hello! Patty",
			          "timeStamp": "2 days ago"
			        },
			        {
			          "senderId": 45,
			          "message": "hi",
			          "timeStamp": "2 days ago"
			        }
		        ]
		    },
		    {
		    	"userId": 55,
		        "conversation": [
		        	{
			          "senderId": 0,
			          "message": "hello! Tilly",
			          "timeStamp": "2 days ago"
			        },
			        {
			          "senderId": 55,
			          "message": "hi",
			          "timeStamp": "2 days ago"
			        }
		        ]
		    }
	    ];

	    messageService.getMessageByUserId = function(userId){
	    	console.log('in Message service');
	    	console.log(userId);
	    	for(var i=0; i<this.messageData.length; i++){
	    		if(userId == this.messageData[i].userId){
	    			return this.messageData[i].conversation;
	    		}
	    	}
	    	return -1;
	    }

	return messageService;
});


appServices.factory('Profile', ['$resource',
  function($resource){

  	var profileFactory = {}

	profileFactory.resource =  $resource(chrome.extension.getURL("profiles/:profileId.json"), {}, {
	      query: {method:'GET', params:{profileId:'profiles'}, isArray:true}
	    });
	return profileFactory.resource;

	//return profileFactory;
  }]);

/* Controllers */

var appControllers = angular.module('appControllers', []);

appControllers.controller('MessageCtrl', ['$scope', 'UiState', 'MessageService', '$location', '$anchorScroll',
	function($scope, UiState, MessageService, $location, $anchorScroll) {

		$scope.messageThreads = MessageService.messageData;
		//$scope.messageThread = MessageService.selectedConversation;//MessageService.getMessageByUserId(UiState.selectedProfile.userId);
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
	        	//$scope.gotoBottom(); reloads and causes extension to close
	        }
        }

        $scope.gotoBottom = function (){
		    // set the location.hash to the id of
		    // the element you wish to scroll to.
		    $location.hash('bottom');
		 
		    // call $anchorScroll()
		    $anchorScroll();
		};

	}]);

appControllers.controller('DanceCardCtrl', ['$scope', '$state', 'UiState', 'MessageService',
	function($scope, $state, UiState, MessageService) {
		$scope.danceCard = [
			{
				"userId": 15,
				"name": "Jane",
				"age": 27,
				"location_city": "Oakland",
				"location_state": "CA",
				"personal_blurb": "I love eating and traveling. Also I like my men perfect...",
				"relevance": 1,
				"imageUrl": "http://lorempixel.com/36/36/people/9/"
			},
			{
				"userId": 25,
				"name": "Sarah",
				"age": 27,
				"imageUrl": "http://lorempixel.com/36/36/people/9/",
				"location_city": "Oakland",
				"location_state": "CA",
				"personal_blurb": "Perhaps I'm unlovable, but maybe not!...",
				"relevance": 1
			},
			{
				"userId": 35,
				"name": "Phillis",
				"age": 27,
				"imageUrl": "http://lorempixel.com/36/36/people/9/",
				"location_city": "Oakland",
				"location_state": "CA",
				"personal_blurb": "I make ice cream every night, do you want some?..",
				"relevance": 1
			},
			{
				"userId": 45,
				"name": "Patty",
				"age": 27,
				"imageUrl": "http://lorempixel.com/36/36/people/9/",
				"location_city": "Oakland",
				"location_state": "CA",
				"personal_blurb": "I'm interested in web design :/...",
				"relevance": 1
			},
			{
				"userId": 55,
				"name": "Tilly",
				"age": 27,
				"imageUrl": "http://lorempixel.com/36/36/people/9/",
				"location_city": "Oakland",
				"location_state": "CA",
				"personal_blurb": "I love to tap dance on stage where everyone can see my moves...",
				"relevance": 1
			}
		];

		$scope.selectOnly = function(i){
	    	UiState.selectedProfile = $scope.danceCard[i];
	    	$scope.selectedProfile = $scope.danceCard[i];
	    	$scope.showShortProfile = true;
	    	$state.go('main.messages');
	    	//MessageService.getMessageByUserId(UiState.selectedProfile.userId);
	    	getConversation(UiState.selectedProfile.userId);
	    }

	    var getConversation = function(userId){
	    	$scope.conversation = MessageService.getMessageByUserId(UiState.selectedProfile.userId);
	    	console.log($scope.conversation);
	    }

	    $scope.showDetailedProfile = function(){
	    	UiState.isSelected = $scope.selectedProfile.userId; 
	    	UiState.showDetailsPanel = true;
	    }

	    $scope.ifSelected = function(){
    	
	    	if(UiState.selectedProfile.userId == $scope.selectedProfile.userId && $scope.selectedProfile != -1){
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

    $scope.profiles = Profile.query();
    //console.log($scope.profiles);

    $scope.selectOnly = function(i){
    	UiState.showDetailsPanel = true;
    	UiState.selectedProfile = $scope.profiles[i];
    }

    $scope.ifSelected = function(i){
    	
    	if(UiState.showDetailsPanel && UiState.selectedProfile.userId == $scope.profiles[i].userId){
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

var bootstrapApp = function(){

	var appRoot = $('#injected-content');
	if(appRoot){

		/* Manually bootstrap the Angular app */
		window.name = '';   // To allow `bootstrap()` to continue normally
		angular.bootstrap(appRoot, ['sidebarDatingExt']);
		console.log('Boot and loaded !');

	}
}
