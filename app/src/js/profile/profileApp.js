/***************************************************************************
/
/ Angular Code, app config, services/factories (models),  and controllers
/
/***************************************************************************/

/* Angular-specific code goes here (i.e. defining and configuring
 * modules, directives, services, filters, etc.) */

var sidebarApp = angular.module('sidebarProfile',[
  'ngRoute',
  'angular-carousel',
  'appControllers',
  'appServices',
  'appDirectives'
]);


sidebarApp.config([
  '$routeProvider',
  
  function(
    $routeProvider
  ) {

    $routeProvider.
      when('/', {
        templateUrl: 'partials/profileDetails.html',
        controller: 'ProfileDetailCtrl'
      });

      console.log("i'm in config for the Profile app");

  }]);

var appDirectives = angular.module('appDirectives', []);
var appServices   = angular.module('appServices', ['ngResource']);
var appControllers = angular.module('appControllers', []);



