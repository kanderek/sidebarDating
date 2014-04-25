'use strict';

/* jasmine specs for controllers go here */

describe('Controller: LoginCtrl', function(){
  
  var scope;
  var state;
  var LoginServiceMock;
  var InitServiceMock;
  var LoginCtrl;

  beforeEach(module('appControllers'));

  beforeEach(function() {
    LoginServiceMock = {
        loginUser: function(loginCreds, callback){
        }
    };

    InitServiceMock = {
        initializeData: function(user){
        }
    };
  });

  beforeEach(inject(function($rootScope, $controller){
    scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
                                           $scope: scope, 
                                           $state: state,
                                           LoginService: LoginServiceMock,
                                           InitService: InitServiceMock
                                         });
  }));

  it('should exist', inject(function($controller) {
    expect(LoginCtrl).toBeDefined();
    // expect(scope.phones.length).toBe(3);
  }));

  it('should call loginUser LoginService method', function(){
      var loginCreds = {email: 'email', password: 'password'};
      spyOn(LoginServiceMock, 'loginUser').andCallThrough();

      scope.login();

      expect(LoginServiceMock.loginUser).toHaveBeenCalled();
  });

});
