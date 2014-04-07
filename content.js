

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
	'profileControllers',
	'profileServices'
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

    $urlRouterProvider.otherwise('/');

    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/',
            views: {
	            'profileList': {
	            	templateUrl: chrome.extension.getURL('partials/profileList.html'),
	            	controller: 'ProfileListCtrl'
	            },
	            'profileDetail': {
	            	templateUrl: chrome.extension.getURL('partials/profileDetails.html'),
	            	controller: 'ProfileListCtrl'
	            },
	            'danceCardMenu': {
	            	templateUrl: chrome.extension.getURL('partials/danceCardMenu.html'),
	            	controller: ''
	            }
	        }
        })
        
        // nested list with custom controller
        // .state('home.list', {
        //     url: '/list',
        //     templateUrl: 'partial-home-list.html',
        //     controller: function($scope) {
        //         $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
        //     }
        // })
        
        // // nested list with just some random string data
        // .state('home.paragraph', {
        //     url: '/paragraph',
        //     template: 'I could sure use a drink right now.'
        // })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('detail', {
            url: '/',
            controller: 'UserProfileCtrl',
            templateUrl: chrome.extension.getURL('partials/profileDetails.html'),
        })

	 	.state('self', {
            url: '/',
            controller: 'UserProfileCtrl',
            templateUrl: chrome.extension.getURL('partials/profileSelf.html'),
        });
  }]);

// var routerApp = angular.module('routerApp', ['ui.router']);

// routerApp.config(function($stateProvider, $urlRouterProvider) {
    
//     $urlRouterProvider.otherwise('/home');
    
//     $stateProvider
        
//         // HOME STATES AND NESTED VIEWS ========================================
//         .state('home', {
//             url: '/home',
//             templateUrl: 'partial-home.html'
//         })
        
//         // nested list with custom controller
//         .state('home.list', {
//             url: '/list',
//             templateUrl: 'partial-home-list.html',
//             controller: function($scope) {
//                 $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
//             }
//         })
        
//         // nested list with just some random string data
//         .state('home.paragraph', {
//             url: '/paragraph',
//             template: 'I could sure use a drink right now.'
//         })
        
//         // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
//         .state('about', {
//             url: '/about',
//             views: {
//                 '': { templateUrl: 'partial-about.html' },
//                 'columnOne@about': { template: 'Look I am a column!' },
//                 'columnTwo@about': { 
//                     templateUrl: 'table-data.html',
//                     controller: 'scotchController'
//                 }
//             }
            
//         });
        
// });

/* Services */

var profileServices = angular.module('profileServices', ['ngResource']);

profileServices.factory('UiState', function(){
	return {};
});


profileServices.factory('Profile', ['$resource',
  function($resource){

  	var profileFactory = {}

	profileFactory.resource =  $resource(chrome.extension.getURL("profiles/:profileId.json"), {}, {
	      query: {method:'GET', params:{profileId:'profiles'}, isArray:true}
	    });
	return profileFactory.resource;

	//return profileFactory;
  }]);

/* Controllers */

var profileControllers = angular.module('profileControllers', []);

profileControllers.controller('UserProfileCtrl', ['$scope', 
	function($scope) {

	}]);

profileControllers.controller('ProfileListCtrl', ['$scope', 'Profile', 'UiState',
  function($scope, Profile, UiState) {

    $scope.profiles = Profile.query();
    //console.log($scope.profiles);

    $scope.doSomething = function(i){
    	console.log('click happened: ' );
    	console.log(i);
    }

    $scope.selectOnly = function(i){
    	console.log('click happened: ' );
    	console.log(i);
    	console.log($scope.uiState.isSelected);
    	$scope.uiState.isSelected = i;
    	$scope.uiState.selectedProfile = $scope.profiles[i];
    }


    $scope.orderProp = 'relevance';

    $scope.uiState = UiState;
    $scope.uiState.isSelected = -1;
  }]);

profileControllers.controller('uiCtrl', ['$scope', '$sce', 'UiState', 
	function($scope, $sce, UiState){
		var arrowLeftIconURL = chrome.extension.getURL("icons/icon_22996/icon_22996.png");
		var arrowRightIconURL = chrome.extension.getURL("icons/icon_22997/icon_22997.png");

		$scope.uiState = UiState;
		$scope.uiState.showSidebar = true;
		$scope.uiState.tabIconUrl = arrowRightIconURL;


		$scope.tabAction = function(){
			console.log($scope.uiState.tabIconUrl);
			if($scope.uiState.showSidebar){
				if($scope.uiState.isSelected != -1){
					$scope.uiState.isSelected = -1;
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

profileControllers.controller('ProfileDetailCtrl', ['$scope', '$stateParams', 'Profile',
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
