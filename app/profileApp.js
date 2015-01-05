// var SERVER = "http://sidebar-dating.herokuapp.com";
var SERVER = "http://localhost:3000";
var url_info = {};


/***************************************************************************
/
/ Angular Code, app config, services/factories (models),  and controllers
/
/***************************************************************************/


/* Angular-specific code goes here (i.e. defining and configuring
 * modules, directives, services, filters, etc.) */

var SIDEBAR_ANIMATION = 1000;
var DETAILS_ANIMATION = 1000;
var SELECT_ANIMATION = 500;

var sidebarApp = angular.module('sidebarDatingExt',[
  'ngRoute',
  'vr.directives.slider',
  'angular-carousel',
  'ngDragDrop',
  'angularFileUpload',
  'ui.router',
  'appControllers',
  'appServices',
  'appDirectives'
]);


sidebarApp.config([
  '$routeProvider',
  '$sceDelegateProvider',
  '$stateProvider',
  '$sceProvider',
  '$provide',
  
  function(
    $routeProvider,
    $sceDelegateProvider,
    $stateProvider,
    $sceProvider,
    $provide) {

    $routeProvider.
      when('/', {
        templateUrl: 'partials/profileList.html',
        controller: ''
      });

    $sceProvider.enabled(false);
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from outer templates domain.
      'chrome-extension://*/partials/**'
    ]);

    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        // .state('file-upload-teset', {
        //   url: '',
        //   views: {
        //     'sidebar': {
        //       templateUrl: 'partials/fileUploadTest.html'),
        //       controller: 'UploadTestCtrl'
        //     }
        //   }
        // })
        // HOME STATES AND NESTED VIEWS ========================================

        .state('main', {
          views: {
              'detailsPanel': {
                templateUrl: 'partials/profileDetails.html',
                controller: 'ProfileDetailCtrl'
              }
          }
        })
        .state('main.detailsPanel', {
                url: '',
              controller: 'ProfileDetailCtrl',
              templateUrl: 'partials/profileSelf.html'
        });


        console.log("i'm in config for the app");

  }]);

/********************************************************************************************************
//
//   dddddd      ii   rrrrrr    eeeee     ccccc      tt      ii    vv     vv    eeeee     ssssss
//   dd    dd         rr   rr  ee   ee   ccc      tttttttt         vv     vv   ee   ee   ss
//   dd     dd   ii   rr       eeeeee    ccc         tt      ii     vv   vv    eeeeee     sssss
//   dd    dd    ii   rr       ee        ccc         tt      ii      vv vv     ee             ss
//   dddddd      ii   rr        eeeeee    ccccc      tt      ii       vvv       eeeeee   ssssss
//
//*******************************************************************************************************
 Directives */

var appDirectives = angular.module('appDirectives', []);

appDirectives.directive('treeMap', function(){
  return {
    restrict: 'A',
    scope: {
      data: '='
    },
    template: "",
    link: function(scope, element, attrs){
      // console.log('in directeve link...');
      // console.log(scope.data);
      // console.log(element);
      // console.log(attrs);

      scope.$watch('data', function(data){
        scope.data = data;
        element.html('');
      if(scope.data){
        var w = 460, h = 200;
        var BORDER = 1;

        var tooltip = d3.select('body'/*element[0]*/).append("div")
          .style("position", "absolute")
          .style("z-index", "10000000000")
          .style("visibility", "hidden")
          .style("background-color", "white")
          .style("padding", "5px");

        var canvas = d3.select(element[0]).append("div")
            .style("width", w + "px")
            .style("height", h + "px")
            .style("position", "relative");

          var treemap = d3.layout.treemap()
              .size([w,h])
              .nodes(scope.data);

          console.log(treemap);

          var cells = canvas.selectAll(".cell")
              .data(treemap)
              .enter()
              .append("div")
              .attr("class", "cell")
              .style("width", function(d) {return  d.dx - 2*BORDER + "px";})
              .style("height", function(d) { return d.dy - 2*BORDER+ "px";})
              .style("top", function(d){ return d.y + "px";})
              .style("left", function(d){ return d.x  - BORDER + "px";})
              .style("background-color", function(d){ return d.parent ? d.parent.color : d.color;})
              .style("position", "absolute")
              .style("border", "2px solid white")
              .style("color", "white")
              // .on("mouseover", function(d){ console.log(d.parent.name)})
              .on("mouseover", function(d){
                // console.log("moused over cell...");
                var tooltipText = "";
                if(d.parent){
                  tooltipText = d.parent.name  + ', ' + d.name;
                }
                return tooltip.style("visibility", "visible").text(tooltipText);
              })
              .on("mousemove", function(){
                // console.log(d3.event.pageX + ", " + d3.event.pageY);
                return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
              })
              .on("mouseout", function(){
                // console.log("moused out from cell...");
                return tooltip.style("visibility", "hidden");
              });

              cells.append("p")
              .text(function(d){return (d.parent && d.area < w*h/20) ? null : d.name;})
              .attr("class", "label-text")
              .style("margin", "5px 0px 0px 5px")
              .style("font-family", "sans-serif");
            }

    });

    },
    controller: function($scope){
      // console.log('in treemap directive controller');
      // console.log($scope.data);

      $scope.$watch('data', function(data) {
        // console.log('watching in directive...');
        // console.log(data);
        $scope.data = data;
      });
    }
  };
});

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
Socket IO Wrapper Service  */

appServices.factory('Socket', function ($rootScope) {
  var socket = io.connect(SERVER);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});


/*******************************************************************************************************
Profile Service  */

appServices.factory('Profile', ['$rootScope', '$http', '$state',
  function($rootScope, $http, $state){

    function processImageUrls(imgArray){
      // console.log('in process images urls....');
      // console.log(imgArray);
      if(imgArray){
        for(var i=0; i<imgArray.length; i++){
          imgArray[i] = SERVER + imgArray[i];
        }
      }
      return imgArray;
    }

    var profileFactory = {};

    profileFactory.pageProfiles = [];
    profileFactory.selectedProfile = {};
    profileFactory.selfProfile = {};
    profileFactory.selfPref = {};
    profileFactory.selectedForRemoval = {};
    profileFactory.previousProfile = {};

    profileFactory.makeFullImageUrl = function(data){
      console.log('making full image urls....before');
      console.log(data);
      for(var i=0; i<data.length; i++){
          data[i].imageurls = processImageUrls(data[i].imageurls);
          data[i].medimageurls = processImageUrls(data[i].medimageurls);
          data[i].smallimageurls = processImageUrls(data[i].smallimageurls);
        }
        console.log('making full image urls....after');
        console.log(data);
        return data;
    };

    profileFactory.initializeProfile = function(user, pref, url){
      console.log('initilize Profile');
      console.log(user);
      if(typeof(user) == 'object'){
        console.log('initializing profile data on signup...');
        console.log(user);
        user = profileFactory.makeFullImageUrl([user]);
        profileFactory.selfProfile = user[0];
        profileFactory.selectedProfile = user[0];
        profileFactory.selfPref = pref;
        // profileFactory.getProfilesByPage(url, user.userid);
        console.log(profileFactory.selfPref);
        var gender = profileFactory.selfPref.male ? 'm' : '';
        gender += profileFactory.selfPref.female ? 'f' : '';
        profileFactory.getStaticProfileList(gender);
        $rootScope.$broadcast('profile-selected');
        $rootScope.$broadcast('user-data-available');
      }
      else{
        profileFactory.getProfileById(user, function(data){
          console.log('iniitializing profile data on login...');
          console.log(data);
          profileFactory.selfProfile = data[0];
          profileFactory.selectedProfile = data[0];
          profileFactory.getProfilesByPage(url, 10);
          $rootScope.$broadcast('profile-selected');
          $rootScope.$broadcast('user-data-available');
        });
      }
    };

    profileFactory.isPageProfile = function(){

    };

    profileFactory.findIndexForPageProfileById = function(userid){
      for(var i=0; i < profileFactory.pageProfiles.length; i++){
        if(profileFactory.pageProfiles[i].userid == userid){
          return i;
        }
      }
      return -1;
    };

    profileFactory.selectProfile = function(user, from) {
      if(user.userid !== profileFactory.previousProfile.userid){
        if(from != 'list'){
          $('#select-indicator').css({'opacity': 0, 'top': '-15px'});
        }
        else{
          var i = profileFactory.findIndexForPageProfileById(user.userid);
          $('#select-indicator').css('top', function(){
            return 18 + 62*i + 'px';
          });
          $('#select-indicator').css('opacity', '1.0');
        }
        profileFactory.selectedProfile = user;
        profileFactory.previousProfile.userid = user.userid;
        $rootScope.$broadcast('profile-selected');
        return false;
      }
      profileFactory.previousProfile.userid = -1;
      return true;
    };

    profileFactory.removeFromPageProfiles = function(userid){
      for(var i=0; i<profileFactory.pageProfiles.length; i++){
        if(profileFactory.pageProfiles[i].userid == userid){
          profileFactory.pageProfiles.splice(i, 1);
          break;
        }
      }
    };

    profileFactory.clearPageProfiles = function(){
      profileFactory.pageProfiles = [];
    };

    profileFactory.getStaticProfileList = function(gender, callback){
      $http({
        method: 'GET',
        url: "staticData/profiles_" + gender + ".json"
      })
        .success(function(data, status, headers, config){
          for(var i=0; i<data.length; i++){
            data[i].smallimageurls[0] = SERVER + data[i].smallimageurls[0];
          }
          profileFactory.pageProfiles = data;
          $rootScope.$broadcast('page-profiles-available');
          // callback(data);
        })
        .error(function(data, status, headers, config){
          console.log('error getting static json file');
        });
    };

    profileFactory.getProfileById = function(userid, callback){
      $http({
        method: 'GET',
        url: SERVER + '/profile/' + userid
      }).
      success(function(data, status, headers, config){
        // if(data.status != "logged_out"){
           // console.log(data);
           data = profileFactory.makeFullImageUrl(data);
           // data[0].imageurls = processImageUrls(data[0].imageurls);
           // data[0].medimageurls = processImageUrls(data[0].medimageurls);
           // data[0].smallimageurls = processImageUrls(data[0].smallimageurls);
           callback(data);
        // }
        // else{
        //     $state.go('sign-up-0');
        // }
      }).
      error(function(data, status, headers, config){
        console.log('error getting user profile ' + userid);
      });
    };

    profileFactory.getProfileByIdPromise = function(userid){
      return $http({
        method: 'GET',
        url: SERVER + '/profile/' + userid
      }).
        success(function (data) {
          return profileFactory.makeFullImageUrl(data);
        });
    };

    profileFactory.getProfilesByInterest = function(userid, callback){
    };

    profileFactory.getIndexOfFirstOutsider = function(){
      for(var i=0; i<profileFactory.pageProfiles; i++){
        if(profileFactory.pageProfiles[i].relevance == 2){
          return i;
        }
      }
      return i;
    };

    profileFactory.getProfilesByPage = function(url, limit){
       console.log('getting profiles by page...');
       console.log(url_info);
       var userid = profileFactory.selfProfile.userid;
       var queryString = "url=" + url_info.url + "&userid=" + userid + "&limit=" +limit;
      if(profileFactory.pageProfiles.length > 0){
         queryString += "&pageprofiles=";
         for(var i=0; i<profileFactory.pageProfiles.length; i++){
             queryString += profileFactory.pageProfiles[i].userid;
             if(i != profileFactory.pageProfiles.length -1){
                queryString += ',';
             }
         }
      }

       $http({
          method: 'GET',
          url: SERVER + '/crowd/?' + queryString
        }).
      success(function(data, status, headers, config) {
        // if(data.status != "logged_out"){
           //callback(data);   // this callback will be called asynchronously when the response is available
          // console.log(data);

          data = profileFactory.makeFullImageUrl(data);
          // for(var i=0; i<data.length; i++){
          //   data[i].imageurls = processImageUrls(data[i].imageurls);
          //   data[i].medimageurls = processImageUrls(data[i].medimageurls);
          //   data[i].smallimageurls = processImageUrls(data[i].smallimageurls);
          // }
          if(limit == 1 && data.length == 1){
            var index = profileFactory.getIndexOfFirstOutsider();
            profileFactory.pageProfiles.splice(index, 0, data[0]);
          }
          else{
            profileFactory.pageProfiles = data;
          }
            console.log(profileFactory.pageProfiles);
          $rootScope.$broadcast('page-profiles-available');
        // }
        // else{
        //   $state.go('sign-up-0');
        // }
      }).
      error(function(data, status, headers, config) {
        console.log('get people failure');
      });
    };

    return profileFactory;

  }]);

/*******************************************************************************************************
Interest Service  */

appServices.factory('InterestService', ['$http', '$rootScope',
  function($http, $rootScope){

    interestService = {};

    interestService.userInterests = {};

    interestService.usersTreemap = function (userid, callback){
      if(interestService.userInterests[userid]){
        console.log(interestService.userInterests[userid]);
        $rootScope.$broadcast('treemap-data-available');
        callback(interestService.userInterests[userid]);
      }
      else{
        console.log('in users Treemap...');
        console.log(userid);
        interestService.getInterestTreemapByUserid(userid, function(data){
          console.log(data);
           $rootScope.$broadcast('treemap-data-available');
          callback(data);
        });
      }
    };

    interestService.getInterestTreemapByUserid = function(userid, callback){

       $http({
          method: 'GET',
          url: SERVER + '/interest/' + userid
        }).
        success(function(data, status, headers, config) {
          // if(data.status != "logged_out"){
             //callback(data);   // this callback will be called asynchronously when the response is available
            // console.log(data);
            interestService.userInterests[userid] = data;
            callback(data);
            // $rootScope.$broadcast('page-profiles-available');
          // }
          // else{
          //   $state.go('sign-up-0');
          // }
        }).
        error(function(data, status, headers, config) {
          console.log('get people failure');
        });
    };

      interestService.getInterestTreemapByUseridPromise = function(userid){

       return $http({
          method: 'GET',
          url: SERVER + '/interest/' + userid
        }).
        success(function(data, status, headers, config) {
          // if(data.status != "logged_out"){
             //callback(data);   // this callback will be called asynchronously when the response is available
            // console.log(data);
            interestService.userInterests[userid] = data;
            // callback(data);
            // $rootScope.$broadcast('page-profiles-available');
          // }
          // else{
          //   $state.go('sign-up-0');
          // }
        }).
        error(function(data, status, headers, config) {
          console.log('get people failure');
        });
    };

    return interestService;

  }]);


appServices.factory('SharedInterestService', ['$http', '$rootScope', 'Profile',
  function($http, $rootScope, Profile){

    sharedInterestService = {};

    sharedInterestService.sharedInterests = function (userid, callback){
      sharedInterestService.getSharedInterestUrls(userid, function(data){
        $rootScope.$broadcast('shared-interest-available');
        callback(data);
      });
    };

    sharedInterestService.getSharedInterestUrls = function(userid1, userid2){

       return $http({
          method: 'GET',
          url: SERVER + '/shared-interest/' + userid1 + '/' + userid2
        }).
        success(function(data, status, headers, config) {
            // console.log('shared-interest success!');
            // console.log(data);
            // callback(data);
        }).
        error(function(data, status, headers, config) {
          console.log('get shared interest failed');
        });
    };

    return sharedInterestService;

  }]);


/*******************************************************************************************************
Init Service  */

appServices.factory('InitService', ['$rootScope','Profile', 'Socket',
  function($rootScope, Profile, Socket){

         var initService = {};

         initService.initializeData = function(user, pref){

            Profile.initializeProfile(user, pref, "someurl");
            var newUser = typeof(user) == 'object';
            var userid = newUser ? user.userid : user;

            console.log('initialize service...');
            console.log('user' + userid);
            Socket.emit('register-user', {userid: userid}, function(){});
          };

          return initService;
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
Check Status Controller  */

appControllers.controller('CheckStatusCtrl', ['$scope', '$rootScope', '$state', 'AuthService', 'InitService',
  function($scope, $rootScope, $state, AuthService, InitService) {

    AuthService.checkUserStatus(function(data){
      console.log(data);
      if(data.status == "logged_in"){
        InitService.initializeData(data.userid);
        $state.go('main.profileList');
      }
      else if(data.status == "logged_out"){
        $state.go('sign-up-0');
      }
    });

  }]);


/*******************************************************************************************************
Profile Detail Controller  */

appControllers.controller('ProfileDetailCtrl', ['$rootScope', '$scope', '$state', 'Profile', 'InterestService', 'SharedInterestService',
  function($rootScope, $scope, $state, Profile, InterestService, SharedInterestService) {

    // $scope.profile = Profile;
    $scope.profile = {};
    $scope.treemapData = {};
    $scope.sharedInterestData = {};
    $scope.slideIndex = 0;
    $scope.viewingSelf = false;
    $scope.dancecardFilled = false;
    $scope.mutualMatch = false;
    $scope.userInDanceCard = false;

    window.addEventListener('message', function (event) {
      console.log('Captured message event in profile iframe');
      console.log(event);

      $scope.viewingSelf = event.data[0] === event.data[1];
      $scope.mutualMatch = event.data[2];
      $scope.userInDanceCard = event.data[3];
      $scope.dancecardFilled = event.data[4];

      Profile.getProfileByIdPromise(event.data[0]).then(function (profileData) {
        console.log(profileData.data[0]);

        $scope.profile.selectedProfile = profileData.data[0];

        $scope.slideIndex = 0;
      
        InterestService.usersTreemap(event.data[0], function(data){
          $scope.treemapData = data;
        });

        SharedInterestService.getSharedInterestUrls(event.data[0], event.data[1]).then(function(data){

          data = data.data[0];

          console.log('shared interest data');
          console.log(data);
          $scope.sharedInterestData = data;

          if (data) {
            for(var i=0; i<data.length; i++){
              var embedURL = data[i].embed_url,
                  embedTag,
                  embedAttrs;
              if(embedURL) {
                embedAttrs = {"src": embedURL};
                embedAttrs = $.extend(embedAttrs, angular.fromJson(data[i].embed_attr));
                embedTag = $('<iframe/>', embedAttrs)[0].outerHTML;
              }
              else {
                tagDiv = $('<div/>');
                tagImg = $('<img/>', {
                  src: data[i].primary_img_url
                });
                tagA1 = $('<a/>', {
                  href: data[i].url,
                  target: "_blank"
                });
                tagP = $('<p/>');
                tagA2 = $('<a/>', {
                  href: data[i].url,
                  target: "_blank",
                  text: data[i].page_title}
                );
                tagA1.html(tagImg).appendTo(tagDiv);
                tagP.html(tagA2).appendTo(tagDiv);
                embedTag = tagDiv[0].outerHTML;
              }
              data[i].embed_tag = embedTag;
            }
          }
        });
      });

    }, false);

    $scope.prev = function() {
        $scope.slideIndex--;
    };
    $scope.next = function() {
        $scope.slideIndex++;
    };

    $scope.isSelf = function(){
      return $scope.viewingSelf;
    };

    $scope.showAddButton = function(){
      return !$scope.userInDanceCard && !$scope.dancecardFilled && !$scope.viewingSelf;
    };

    $scope.showRemoveButton = function(){
      return $scope.userInDanceCard && !$scope.isSelf();
    };

    $scope.showMessageButton = function(){
      return $scope.mutualMatch && !$scope.viewingSelf;
    };

    // var isInDanceCard = function(userid){

    //   for(var i=0; i<DancecardService.dancecard.length; i++) {
    //     if(DancecardService.dancecard[i].userid == userid){
    //       return true;
    //     }
    //   }
    //   return false;
    // };

    // var isMutual = function(userid){
    //   for(var i=0; i<DancecardService.dancecard.length; i++) {
    //     if(DancecardService.dancecard[i].userid == userid){
    //       return DancecardService.dancecard[i].mutual;
    //     }
    //   }
    //   return false;
    // };

    // var isDancecardFilled = function(){
    //   return (DancecardService.isDancecardFilled());
    // };

    // $scope.updateDancecard = function(user, status){
    //   var data = {
    //     userid: Profile.selfProfile.userid,
    //     partnerid: user.userid,
    //     status: status
    //   };

    //   if(status == 'added'){
    //      DancecardService.updateDancecard(data, user);
    //   }

    //   if(status == 'removed'){
    //         Profile.selectedForRemoval = user;
    //         UiState.showDetailsPanel = false;
    //         if(user.mutual){
    //           // $state.go('main.profileList');
    //           $state.go('main.removeSurvey');
    //         }
    //         else{
    //             DancecardService.updateDancecard(data, user);
    //             $state.go('main.profileList');
    //         }
    //   }
    // };
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
