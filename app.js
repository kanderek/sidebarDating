'use strict';

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
    return $resource('profiles/:profileId.json', {}, {
      query: {method:'GET', params:{profileId:'profiles'}, isArray:true}
    });
  }]);


/* Controllers */

var profileControllers = angular.module('profileControllers', []);

profileControllers.controller('ProfileListCtrl', ['$scope', 'Profile',
  function($scope, Profile) {
    $scope.profiles = Profile.query();
    $scope.orderProp = 'relevence';
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


