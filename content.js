

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
var app = angular.module('cs_myApp', []);
app.controller('cs_myCtrl', function ($scope) {
    $scope.data = {
        demo: 'Hello, isolated world !'
    };
});


var sidebarApp = angular.module('sidebarDatingExt', [
	//'ngRoute',
	'profileControllers',
	'profileServices'
]);


// sidebarApp.config(['$routeProvider',
//   function($routeProvider) {
//     $routeProvider.
//       when('/profiles', {
//         templateUrl: 'partials/profileList.html',
//         controller: 'ProfileListCtrl'
//       }).
//       when('/profiles/:profileId', {
//         templateUrl: 'partials/profileDetails.html',
//         controller: 'ProfileDetailCtrl'
//       }).
//       otherwise({
//         redirectTo: '/profiles'
//       });
//   }]);

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

profileControllers.controller('ProfileListCtrl', ['$scope', 'Profile',
  function($scope, Profile) {
    $scope.profiles = Profile.query();
    console.log($scope.profiles);
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
