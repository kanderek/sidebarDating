'use strict';

/* jasmine specs for services go here */

describe('LoginService : Factory', function() {

  var scope;
  var http;	
  var LoginService;

  beforeEach(module('appServices'));

  beforeEach(inject(function($rootScope, $httpBackend, _LoginService_){
    scope = $rootScope.$new();
    http = $httpBackend;
    LoginService = _LoginService_;

  }));

  // beforeEach(module(function ($provide) {
  // 	$provide.value('LoginService', {
  // 		loginUser: function(creds, callback)
  // 	});
  // }));

  afterEach(function() {
    http.verifyNoOutstandingExpectation();
    http.verifyNoOutstandingRequest();
  });

  it('should return current version', inject(function(version) {
	expect(version).toEqual('0.1');
  }));

   it('should exist...', inject(function(LoginService){
  	expect(LoginService).toBeDefined();
  }));

  it('should have an loginUser function', function () { 
    expect(angular.isFunction(LoginService.loginUser)).toBe(true);
  });

  describe('LoginService method', function(){
  	it('loginUser should post to server', function() {
 
	     http.expectPOST('http://localhost:3000/login', {email: 'email', password: 'password'}).respond(201, '');
	     LoginService.loginUser({email: 'email', password: 'password'}, function(data){});
	     http.flush();
	});

  	it('should have json defined in header', function() {
 
         http.expectPOST('http://localhost:3000/login', undefined, 
          {"Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=utf-8"}
         ).respond(201, '');
 
         LoginService.loginUser({email: 'email', password: 'password'}, function(data){});
         http.flush();
    });

  });

});


//   function MyController($scope, $http) {
//     var authToken;
 
//     $http.get('/auth.py').success(function(data, status, headers) {
//       authToken = headers('A-Token');
//       $scope.user = data;
//     });
 
//     $scope.saveMessage = function(message) {
//       var headers = { 'Authorization': authToken };
//       $scope.status = 'Saving...';
 
//       $http.post('/add-msg.py', message, { headers: headers } ).success(function(response) {
//         $scope.status = '';
//       }).error(function() {
//         $scope.status = 'ERROR!';
//       });
//     };
//   }
// Now we setup the mock backend and create the test specs:

//     // testing controller
//     describe('MyController', function() {
//        var $httpBackend, $rootScope, createController;
 
//        beforeEach(inject(function($injector) {
//          // Set up the mock http service responses
//          $httpBackend = $injector.get('$httpBackend');
//          // backend definition common for all tests
//          $httpBackend.when('GET', '/auth.py').respond({userId: 'userX'}, {'A-Token': 'xxx'});
 
//          // Get hold of a scope (i.e. the root scope)
//          $rootScope = $injector.get('$rootScope');
//          // The $controller service is used to create instances of controllers
//          var $controller = $injector.get('$controller');
 
//          createController = function() {
//            return $controller('MyController', {'$scope' : $rootScope });
//          };
//        }));
 
 
//        it('should fetch authentication token', function() {
//          $httpBackend.expectGET('/auth.py');
//          var controller = createController();
//          $httpBackend.flush();
//        });
 
 
//        it('should send msg to server', function() {
//          var controller = createController();
//          $httpBackend.flush();
 
//          // now you don’t care about the authentication, but
//          // the controller will still send the request and
//          // $httpBackend will respond without you having to
//          // specify the expectation and response for this request
 
//          $httpBackend.expectPOST('/add-msg.py', 'message content').respond(201, '');
//          $rootScope.saveMessage('message content');
//          expect($rootScope.status).toBe('Saving...');
//          $httpBackend.flush();
//          expect($rootScope.status).toBe('');
//        });
 
 
//        it('should send auth header', function() {
//          var controller = createController();
//          $httpBackend.flush();
 
//          $httpBackend.expectPOST('/add-msg.py', undefined, function(headers) {
//            // check if the header was send, if it wasn't the expectation won't
//            // match the request and the test will fail
//            return headers['Authorization'] == 'xxx';
//          }).respond(201, '');
 
//          $rootScope.saveMessage('whatever');
//          $httpBackend.flush();
//        });
//     });