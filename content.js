

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


sidebarApp.config(['$urlRouterProvider', '$sceDelegateProvider', '$stateProvider',
  function($urlRouterProvider, $sceDelegateProvider, $stateProvider) {
  	 $sceDelegateProvider.resourceUrlWhitelist([
	    // Allow same origin resource loads.
	    'self',
	    // Allow loading from outer templates domain.
	    'chrome-extension://*/partials/**'
	  ]); 

    $urlRouterProvider.
      // when('/profiles', {
      //   // templateUrl: chrome.extension.getURL('partials/profileList.html'),
      //   // controller: 'ProfileListCtrl',
      //   // reloadOnSearch: false
      // }).
      // when('/profiles/:profileId', {
      //   // templateUrl: chrome.extension.getURL('partials/profileDetails.html'),
      //   // controller: 'ProfileDetailCtrl',
      //   // reloadOnSearch: false
      // }).
      // when('/profiles/self', {
      // 	// templateUrl: chrome.extension.getURL('partials/profileDetails.html'),
      // 	// controller: 'UserProfileCtrl',
      // 	// reloadOnSearch: false
      // }).
      otherwise('/main');

    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('profiles', {
            url: '/main',
            templateUrl: chrome.extension.getURL('partials/profileList.html'),
            controller: 'ProfileListCtrl'
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
            url: '/main',
            controller: 'UserProfileCtrl',
            templateUrl: chrome.extension.getURL('partials/profileDetails.html'),
        })

	 	.state('self', {
            url: '/main',
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

profileServices.factory('Profile', ['$resource',
  function($resource){
    return $resource(chrome.extension.getURL("profiles/:profileId.json"), {}, {
      query: {method:'GET', params:{profileId:'profiles'}, isArray:true}
    });
  }]);

/* Controllers */

var profileControllers = angular.module('profileControllers', []);

profileControllers.controller('UserProfileCtrl', ['$scope', 
	function($scope) {

	}]);

profileControllers.controller('ProfileListCtrl', ['$scope', 'Profile',
  function($scope, Profile) {
    $scope.profiles = Profile.query();
    //console.log($scope.profiles);
    $scope.orderProp = 'relevance';
  }]);

profileControllers.controller('ProfileDetailCtrl', ['$scope', '$routeParams', 'Profile',
  function($scope, $routeParams, Profile) {
    $scope.profile = Profile.get({profileId: $routeParams.profileId}, function(profile) {
      $scope.mainImageUrl = profile.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
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
