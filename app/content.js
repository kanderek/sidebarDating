// var SERVER = "http://sidebar-dating.herokuapp.com";
var SERVER = "http://localhost:3000";
var url_info = {};

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
        console.log(message.data);
        url_info = message.data;
				$.get(chrome.extension.getURL('/content.html'), function(data) {
				    	$(data).appendTo('body');
				    	bootstrapApp();
				});
			}
			break;
		case "close-sidebar":
			console.log('closing sidebar');
      setTimeout(function(){
          $('#injected-content').remove();
          console.log('sidebar closed');
      }, 500);
			break;
	}
});

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
  'vr.directives.slider',
  'angular-carousel',
  'ngAnimate',
  'draganddrop',
  'ngDragDrop',
  'angularFileUpload',
  'ui.router',
  'appControllers',
  'appServices',
  'appDirectives'
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
        // .state('file-upload-teset', {
        //   url: '',
        //   views: {
        //     'sidebar': {
        //       templateUrl: chrome.extension.getURL('partials/fileUploadTest.html'),
        //       controller: 'UploadTestCtrl'
        //     }
        //   }
        // })
        // HOME STATES AND NESTED VIEWS ========================================

        .state('check-status', {
          url: '',
          views: {
            'sidebar': {
              templateUrl: chrome.extension.getURL('partials/checkStatus.html'),
              controller: 'CheckStatusCtrl'
            }
          }
        })

        .state('sign-up-0', {
          url: '',
          views: {
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/signup0.html'),
                controller: 'SignupCtrl'
              }
          }
        })

        .state('sign-up-1', {
          url: '',
          views: {
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/signup1.html'),
                controller: 'SignupCtrl'
              }
          }
        })

        .state('sign-up-2', {
          url: '',
          views: {
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/signup2.html'),
                controller: 'SignupCtrl'
              }
          }
        })

        .state('sign-up-3', {
          url: '',
          views: {
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/signup3.html'),
                controller: 'SignupCtrl'
              }
          }
        })

        .state('login', {
          url: '',
          views: {
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/login.html'),
                controller: 'LoginCtrl'
              }
          }
        })

        .state('main', {
          views: {
            'sidebar': {
                templateUrl: chrome.extension.getURL('partials/danceCardMenu.html'),
                controller: 'DanceCardCtrl'
              },
              'detailsPanel': {
                templateUrl: chrome.extension.getURL('partials/profileDetails.html'),
                controller: 'ProfileDetailCtrl'
              }
          }
        })

        .state('main.history-test', {
          url: '',
          templateUrl: chrome.extension.getURL('partials/historyTest.html'),
          controller: 'HistoryTestCtrl'
        })

        .state('main.notifications', {
          url: '',
          templateUrl: chrome.extension.getURL('partials/notifications.html'),
            controller: 'NotificationCtrl'
            })

        .state('main.profileList', {
          url: '',
          templateUrl: chrome.extension.getURL('partials/profileList.html'),
            controller: 'ProfileListCtrl'
            })

        .state('main.removeSurvey', {
          url: '',
          templateUrl: chrome.extension.getURL('partials/removeSurvey.html'),
            controller: 'RemoveSurveyCtrl'
            })

        .state('main.messages', {
              url: '',
          templateUrl: chrome.extension.getURL('partials/messages.html') ,
            controller: 'MessageCtrl'
            })

        .state('main.detailsPanel', {
                url: '',
              controller: '',
              templateUrl: chrome.extension.getURL('partials/profileSelf.html')
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
          .style("padding", "5px")

        var canvas = d3.select(element[0]).append("div")
            .style("width", w + "px")
            .style("height", h + "px")
            .style("position", "relative")

          var treemap = d3.layout.treemap()
              .size([w,h])
              .nodes(scope.data);

          console.log(treemap);

          var cells = canvas.selectAll(".cell")
              .data(treemap)
              .enter()
              .append("div")
              .attr("class", "cell")
              .style("width", function(d) {return  d.dx - 2*BORDER + "px"})
              .style("height", function(d) { return d.dy - 2*BORDER+ "px"})
              .style("top", function(d){ return d.y + "px"})
              .style("left", function(d){ return d.x  - BORDER + "px"})
              .style("background-color", function(d){ return d.parent ? d.parent.color : d.color})
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
              .text(function(d){return (d.parent && d.area < w*h/20) ? null : d.name})
              .attr("class", "label-text")
              .style("margin", "5px 0px 0px 5px")
              .style("font-family", "sans-serif")
            }

    })

    },
    controller: function($scope){
      // console.log('in treemap directive controller');
      // console.log($scope.data);

      $scope.$watch('data', function(data) {
        // console.log('watching in directive...');
        // console.log(data);
        $scope.data = data;
      })
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
Ui State Service  */

appServices.factory('UiState', ['$timeout', 'Profile', function($timeout, Profile){

  var dom = {
            select: $( "#select-indicator" ),
            details: $( "#detailsWrapper" ),
            sidebar: $( "#sbe-sidebar" ),
        };
  var detailsPanel = document.getElementById('detailsWrapper');
  var detailsContent = document.getElementById('detailsContent');
  var sidebar = document.getElementById('sidebar');

  detailsPanel.addEventListener("webkitAnimationEnd",
    function(event){
      //only happens if transition finishes
      console.log(event.animationName);
      if(event.animationName == "openDetails"){
        console.log('should do something...');
        if(!$('#detailsContent').hasClass('dancecard')){
         $( "#select-indicator" ).removeClass().addClass('apply-indicator');
       }
       $('#details.Content').removeClass();
      }
    }, false);

  console.log(detailsPanel);
  console.log(detailsContent);
  detailsContent.addEventListener('webkitTransitionEnd',
    function(event){
      $('#detailsContent').css('opacity', 1.0);
    },false);

  var uiStateService = {};

  uiStateService.previousState;
  uiStateService.currentState;
  uiStateService.showSidebar = true;
  uiStateService.showDetailsPanel = false;
  uiStateService.showShortProfile = false;

  uiStateService.shutdown = function(){
    // dom.sidebar.addClass('shutdownPanel');
    // dom.details.addClass('shutdownDetails');
    dom.sidebar.css('-webkit-transform', 'translateX(780px)');
    dom.details.css('-webkit-transform', 'translateX(780px)');
  }

  uiStateService.resetSelectIndicator = function(){
    $('#select-indicator').removeClass().addClass('apply-indicator');
  }

  uiStateService.selectTransition = function(){
      $('#detailsContent').css('opacity', 0);
  }

  uiStateService.selectProfile = function(user, from){
    // uiStateService.selectTransition();
    // uiStateService.showShortProfile = false;
    console.log('selected profile from...');
    console.log(from);
   if( $('#select-indicator').hasClass('init-indicator') && uiStateService.showDetailsPanel){
    if(from == 'list'){
     uiStateService.resetSelectIndicator();
    }
   }
    return Profile.selectProfile(user,from);
  }

  uiStateService.openDetailsPanel = function(){
    console.log('opendetailspanel called');
    uiStateService.showDetailsPanel = true;
    dom.details.removeClass().addClass('openDetails');
  }

uiStateService.closeDetailsPanel = function(){
console.log('closedetailspanel called');
  console.log('select indicator...');

    uiStateService.showDetailsPanel = false;
   var select = $('#select-indicator');
     console.log(select);
   if(select.hasClass('apply-indicator')){
     select.removeClass('apply-indicator').addClass('remove-indicator');
   }
   else{
     dom.details.removeClass().addClass('closeDetails');
   }
  }

  uiStateService.openSidebar = function(){
    console.log('show sidebar');
    uiStateService.showSidebar = true;
    dom.sidebar.removeClass().addClass('openPanel');
    dom.details.removeClass().addClass('revealDetails');
  }

  uiStateService.closeSidebar = function(){
    console.log('close sidebar');
    uiStateService.showSidebar = false;
    dom.sidebar.removeClass().addClass('closePanel');
    dom.details.removeClass().addClass('tuckDetails');
  }


  return uiStateService;
}]);

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
      })
    }
  };
});

/*******************************************************************************************************
Message Service  */

appServices.factory('MessageService', ['$http', '$state', '$interval', '$rootScope', 'Profile',
  function($http, $state, $interval, $rootScope, Profile){

      function updateRelativeTimestamps(data){
        var sendtime1;
        var sendtime2;

        if(typeof data !== 'undefined' && data.length > 1){
          for(var i=1; i<data.length; i++){
             sendtime1 = moment(data[i-1].sendtime).fromNow() == 'a few seconds ago' ? 'just now' : moment(data[i-1].sendtime).fromNow();
             sendtime2 = moment(data[i].sendtime).fromNow() == 'a few seconds ago' ? 'just now' : moment(data[i].sendtime).fromNow();

              if(sendtime1 != sendtime2){
               //  console.log('compared two times and were not the same...');
               // console.log(moment(data[i-1].sendtime).fromNow());
               // console.log(moment(data[i].sendtime).fromNow());
               data[i].relativeTimestamp = sendtime2;
             }
             else {
               data[i].relativeTimestamp = "";
             }
         }
        }
         if(typeof data !== 'undefined' && data[0]){
            data[data.length-1].relativeTimestamp = moment(data[data.length-1].sendtime).fromNow() == 'a few seconds ago' ? 'just now' : moment(data[data.length-1].sendtime).fromNow()
          }
        return data;
      }

      function refreshTimestamps(){
        if(messageService.messages[Profile.selectedProfile.userid]){
         $interval(function(){
          updateRelativeTimestamps(messageService.messages[Profile.selectedProfile.userid])
          console.log('refreshing timestamps....');

        }
          , 60000);
       }
      }

  var messageService = {};

      messageService.messages = {};

      messageService.getConversationWith = function(userid){
        console.log('getting conversation with.... ' + userid);
        console.log('RETEIVING:  message service messages!!!');
        console.log(messageService.messages);
        if(messageService[userid]){
          messageService[userid] = updateRelativeTimestamps(messageService[userid]);
          console.log(messageService.messages[userid]);
          refreshTimestamps();
           $rootScope.$broadcast('conversation-available', messageService[userid]);
          // return messageService[userid];
        }
        else{
          messageService.getMessageByuserid(userid, function(data){
            messageService.messages[userid] = data;
            refreshTimestamps();
            console.log(messageService.messages);
            // return data;

            $rootScope.$broadcast('conversation-available', data);
          })
        }
      }

      messageService.updateConversationWith = function(userid, message){
        console.log('UPDATE: message service messages!!!');
        console.log(messageService.messages);
        //message.relativeTimestamp = 'just now';//moment(message.sendtime).fromNow();
        if(messageService.messages[userid]){
          messageService.messages[userid].push(message);
        }
        else {
          messageService.messages[userid] = [message];
        }
        updateRelativeTimestamps(messageService.messages[userid]);
        $rootScope.$broadcast('conversation-available', messageService.messages[userid]);
      }

      messageService.sendMessageTo = function(message) {
          message.relativeTimestamp = 'just now';//moment().fromNow();
          message.sendtime = moment();
          messageService.messages[message.receiverid].push(message);
          updateRelativeTimestamps(messageService.messages[message.receiverid]);
          messageService.sendMessageTouserid(message, function(data){});
      }

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

      messageService.getMessageByuserid = function(userid, callback){
        $http({
          method: 'GET',
          url: SERVER + "/message/" + userid + "/?userId=" + Profile.selfProfile.userid
        }).
        success(function(data, status, headers, config){
            // if(data.status != "logged_out"){
               // console.log(data);
               if(data){
                  data = updateRelativeTimestamps(data);
               }
               else {
                  //data received is empty...
               }
                callback(data);
            // }
            // else{
            //   $state.go('sign-up-0');
            // }
        }).
        error(function(data, status, headers, config){
          console.log('error getting static json file');
        });
      }

      messageService.sendMessageTouserid = function(message, callback){
        if(message.senderid != message.receiverid){
          $http({
            method: 'POST',
            url: SERVER + "/message/",
            data: message
          }).
          success(function(data, status, headers, config){
            // if(data.status != "logged_out"){
               callback(data);
            // }
            // else{
            //   $state.go('sign-up-0');
            // }
          }).
          error(function(data, status, headers, config){
            console.log('error posting message');
          });
        }
        else{
          console.log('Cannot send message to yourself');
        }
      }

  return messageService;
}]);

/*******************************************************************************************************
Notification Service  */

appServices.factory('NotificationService', ['$http', '$interval', '$state', 'Profile',
  function($http, $interval, $state, Profile){

      function refreshTimestamps(){
         $interval(function(){
          for(var i=0; i< notificationService.notifications.length; i++){
            notificationService.notifications[i].relativeTimestamp = moment(notificationService.notifications[i].action_time).fromNow();
          }
          console.log('refreshing timestamps for notifications....');
        }
          , 60000);
      }

  var notificationService = {};

      notificationService.notifications = [];
      notificationService.unreadCount = 0;

      notificationService.getUnreadCount = function(){

          notificationService.unreadCount = 0;
          for(var i=0; i<notificationService.notifications.length; i++){
            if(notificationService.notifications[i].status == "unread"){
              notificationService.unreadCount += 1;
            }
          }
          return notificationService.unreadCount;
      }

      notificationService.markRead = function(index){
        if(notificationService.notifications[index].status == 'unread'){
          notificationService.unreadCount--;
          notificationService.notifications[index].status = 'read';
          notificationService.updateNotificationStatus({
                notification: {
                  status: notificationService.notifications[index].status,
                  notificationid: notificationService.notifications[index].notificationid
                }
              });
        }
      }

      notificationService.addNotification = function(notification){
          notification.relativeTimestamp = moment(notification.action_time).fromNow();
          notification.smallimage = SERVER + '/' + notification.imgurl;
          notificationService.notifications.unshift(notification);
          notificationService.unreadCount++;
      }

      notificationService.initializeNotifications = function(userid){
        notificationService.getNotifications(userid);
        refreshTimestamps();
      }

      notificationService.getNotifications = function(userid){
        $http({
          method: 'GET',
          url: SERVER + "/notifications/" + userid
        }).
        success(function(data, status, headers, config){
            // if(data.status != "logged_out"){
               // callback(data);

              for(var i=0; i<data.length; i++){
                data[i].relativeTimestamp = moment(data[i].action_time).fromNow();
                data[i].smallimage = SERVER + '/' + data[i].smallimageurls[0]
              }

               console.log(data);
               notificationService.notifications = data;
               notificationService.getUnreadCount()
            // }
            // else{
            //   $state.go('sign-up-0');
            // }
        }).
        error(function(data, status, headers, config){
          console.log('error getting static json file');
        });
      }

      notificationService.updateNotificationStatus = function(data){
          $http({
            method: 'POST',
            url: SERVER + "/notifications/",
            data: data
          }).
          success(function(data, status, headers, config){
               // callback(data);
               //update

          }).
          error(function(data, status, headers, config){
            console.log('error posting message');
          });
        }

  return notificationService;
}]);


/*******************************************************************************************************
Dancecard Service  */

appServices.factory('DancecardService', ['$rootScope', '$http', 'Profile',
  function($rootScope, $http, Profile){

  function fillBlankDancecardSpots(){
     var curDancecardLength = dancecardService.dancecard.length;
     for(var i=0; i<(5-curDancecardLength); i++){
       dancecardService.dancecard.push({smallimageurls: [ SERVER + '/user/user.png'], userid: -1});
     }
  }

  function getNumberFreeDancecardSpots(){
      if(dancecardService.dancecard.length == 0) return 5;
      var count = 0;
      for(var i=0; i<5; i++){
          if(dancecardService.dancecard[i].userid == -1){
            count++;
          }
      }
      return count;
    }

  var dancecardService = {};

      dancecardService.dancecard = [];
      dancecardService.interestedPeople = [];

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

      dancecardService.isDancecardFilled = function(){
        return (getNumberFreeDancecardSpots() <= 0);
      }

      dancecardService.initializeDancecard = function(userid){
        dancecardService.dancecard = [];
        dancecardService.interestedPeople = [];
        dancecardService.getDancecardById(userid, function(data){});
        dancecardService.getInterestedPeopleById(userid);
      }

      dancecardService.addInterestedPerson = function(userid){
        dancecardService.interestedPeople.push({userid: parseInt(userid)});
        console.log('people interested in you by id...');
        console.log(dancecardService.interestedPeople);
      }

      dancecardService.noLongerInterested = function(userid){
        for(var i=0; i<dancecardService.dancecard.length; i++){
          if(dancecardService.dancecard[i].userid == userid){
            dancecardService.dancecard[i].mutual = false;
            return;
          }
        }

        for(var i=0; i<dancecardService.interestedPeople.length;i++){
          if(dancecardService.interestedPeople[i] == userid){
            dancecardService.interestedPeople.splice(i, 1);
            break;
          }
        }
      }

      dancecardService.hadAddedYou = function(userid){
        for(var i=0; i<dancecardService.interestedPeople.length; i++){
          if ( dancecardService.interestedPeople[i].userid == userid ){
            return true;
          }
        }
        return false;
      }

      dancecardService.setMutual = function(userid){
        for(var i=0; i<dancecardService.dancecard.length; i++){
          if(dancecardService.dancecard[i].userid == userid){
            dancecardService.dancecard[i].mutual = true;
            break;
          }
        }
      }

      dancecardService.getInterestedPeopleById = function(userid){
        // console.log('in dancecard service...');
        // console.log(UiState);
        // console.log(UiState.selfProfile.userid);
        // console.log(UiState.selfProfile.userid);
        $http({
          method: 'GET',
          url: SERVER + "/dancecard/interested/"+userid
        })
        .success(function(data, status, headers, config){
            // if(data.status != "logged_out"){
               dancecardService.interestedPeople  = data;
               //callback(data);

            // }
            // else{
            //   $state.go('sign-up-0');
            // }
        }).
        error(function(data, status, headers, config){
          console.log('error getting dancecard');
        });
      }

      dancecardService.getDancecardById = function(userid, callback){
        // console.log('in dancecard service...');
        // console.log(UiState);
        // console.log(UiState.selfProfile.userid);
        // console.log(UiState.selfProfile.userid);
        $http({
          method: 'GET',
          url: SERVER + "/dancecard/"+userid
        })
        .success(function(data, status, headers, config){
            // if(data.status != "logged_out"){
               data = Profile.makeFullImageUrl(data);
               dancecardService.dancecard = data;
               fillBlankDancecardSpots();
               console.log('...gettinng dancecard...');
               console.log(data);
               $rootScope.$broadcast('dancecard-available');
               //callback(data);

            // }
            // else{
            //   $state.go('sign-up-0');
            // }
        }).
        error(function(data, status, headers, config){
          console.log('error getting dancecard');
        });
      }

      // dancecardService.updateDancecard = function(postData, profileData, callback){
        dancecardService.updateDancecard = function(postData, profileData){

        for(var i=0; i<5; i++){
          if(postData.status == 'added'){
            if(dancecardService.dancecard[i].userid == -1){
              $('#select-indicator').css({'top': '-20px', 'opacity': 0});
              dancecardService.dancecard[i] = profileData;
              if(dancecardService.hadAddedYou(profileData.userid)){
                dancecardService.dancecard[i].mutual = 'true';
              }
              $rootScope.$broadcast('dancecard-update');
              dancecardService.postDancecardUpdate(postData, function(data){
                console.log('in dancecard service : changed happened...');
                console.log(data);
                Profile.removeFromPageProfiles(profileData.userid);
                Profile.getProfilesByPage("someurl", 1);
              })
              break;
            }
          }

          if(postData.status == 'removed'){
            if(dancecardService.dancecard[i].userid == profileData.userid){
              dancecardService.dancecard.splice(i,1);
              dancecardService.dancecard.push({smallimageurls: [SERVER + '/user/user.png'], userid: -1});
              $rootScope.$broadcast('dancecard-update');
              if(Profile.selectedProfile.userid == Profile.selectedForRemoval.userid){
                Profile.selectedProfile = Profile.selfProfile;
              }
              Profile.selectedForRemoval = {};
              dancecardService.postDancecardUpdate(postData, function(data){
                //
              })
              break;
            }
          }
        }
      }

        dancecardService.postDancecardUpdate = function(postData, callback){

          $http({
            method: 'POST',
            url: SERVER + "/dancecard",
            data: postData
          }).
          success(function(data, status, headers, config){
              // if(data.status != "logged_out"){
                 callback(data);

              // }
              // else{
              //   $state.go('sign-up-0');
              // }
          }).
          error(function(data, status, headers, config){
            console.log('error posting data: add dancecard failed');
          });
        }


  return dancecardService;
}]);

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
      for(var i=0; i<data.length; i++){
          data[i].imageurls = processImageUrls(data[i].imageurls);
          data[i].medimageurls = processImageUrls(data[i].medimageurls);
          data[i].smallimageurls = processImageUrls(data[i].smallimageurls);
        }
        return data;
    }

    profileFactory.initializeProfile = function(user, pref, url){
      console.log('initilize Profile');
      console.log(user);
      if(typeof(user) == 'object'){
        console.log('initializing profile data on signup...');
        console.log(user);
        profileFactory.selfProfile = user;
        profileFactory.selectedProfile = user;
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
        })
      }
    }

    profileFactory.isPageProfile = function(){

    }

    profileFactory.findIndexForPageProfileById = function(userid){
      for(var i=0; i < profileFactory.pageProfiles.length; i++){
        if(profileFactory.pageProfiles[i].userid == userid){
          return i;
        }
      }
      return -1;
    }

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
    }

    profileFactory.removeFromPageProfiles = function(userid){
      for(var i=0; i<profileFactory.pageProfiles.length; i++){
        if(profileFactory.pageProfiles[i].userid == userid){
          profileFactory.pageProfiles.splice(i, 1);
          break;
        }
      }
    }

    profileFactory.clearPageProfiles = function(){
      profileFactory.pageProfiles = [];
    }

    profileFactory.getStaticProfileList = function(gender, callback){
      $http({
        method: 'GET',
        url: chrome.extension.getURL("staticData/profiles_" + gender + ".json")
      }).
      success(function(data, status, headers, config){
        for(var i=0; i<data.length; i++){
          data[i].smallimageurls[0] = SERVER + data[i].smallimageurls[0];
        }
        profileFactory.pageProfiles = data;
        $rootScope.$broadcast('page-profiles-available');
        // callback(data);
      }).
      error(function(data, status, headers, config){
        console.log('error getting static json file');
      });
    }

    profileFactory.getProfileById = function(userid, callback){
      $http({
        method: 'GET',
        url: SERVER + '/profile/'+userid
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
    }

    profileFactory.getProfilesByInterest = function(userid, callback){
    }

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

          profileFactory.pageProfiles = profileFactory.pageProfiles.concat(data);
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
    }

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
    }

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

    sharedInterestService.getSharedInterestUrls = function(userid, callback){

       $http({
          method: 'GET',
          url: SERVER + '/shared-interest/' + userid + '/' + Profile.selfProfile.userid
        }).
        success(function(data, status, headers, config) {
            // console.log('shared-interest success!');
            // console.log(data);
            callback(data);
        }).
        error(function(data, status, headers, config) {
          console.log('get shared interest failed');
        });
    }

    return sharedInterestService;

  }]);

/*******************************************************************************************************
Signup Service  */

appServices.factory('SignupService', ['$http', 'Profile',
  function($http, Profile){

    var signupService = {};

    signupService.user = {};
    signupService.pref = {};

    signupService.requestInfoFromBackground = function(message){
        chrome.runtime.sendMessage({type: 'request', command: message}, function(response) {
          console.log('response from background script...');
          console.log(response);
        });
    }

    signupService.signupUser = function(callback){
      console.log('signup user!');
      $http({
        method: 'POST',
        url: SERVER + "/signup",
        data: {email: signupService.user.email, password: signupService.user.password, user: signupService.user, pref: signupService.pref}
      }).
      success(function(data, status, headers, config){
        callback(data);
        signupService.user = {};
        signupService.pref = {};
      }).
      error(function(data, status, headers, config){
        console.log('error signing up user: sending data to server failed');
      });
    }

    return signupService;

  }]);

/*******************************************************************************************************
Signup Service  */

appServices.factory('HistoryService', ['$http', 'Profile',
  function($http, Profile){

    var historyService = {};

    historyService.currentUrl;

    historyService.getHistory = function(callback){
        var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
        var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
        var limit = 30;

        chrome.runtime.sendMessage({type: 'history', time_ago: oneWeekAgo, limit: limit}, function(response) {
            console.log('response from background script...');
            console.log(response);
            // $scope.output = response;
            callback(response);
          });
      };


    historyService.saveHistory = function(data, callback){
      $http({
        method: 'POST',
        url: SERVER + "/history",
        data: {userid: Profile.selfProfile.userid, history: data}
      }).
      success(function(data, status, headers, config){
        callback(data);
      }).
      error(function(data, status, headers, config){
        console.log('error saving history data...');
      });
    }

    return historyService;

  }]);

/*******************************************************************************************************
Login Service  */

appServices.factory('LoginService', ['$http', 'Socket',
  function($http, Socket){

    var loginService = {};

    loginService.loginUser = function(credentials, callback){
      $http({
        method: 'POST',
        url: SERVER + "/login",
        data: credentials
      }).
      success(function(data, status, headers, config){
        callback(data);

      }).
      error(function(data, status, headers, config){
        console.log('error logging in user');
      });
    }

    return loginService;

  }]);

/*******************************************************************************************************
Authentication Service  */

appServices.factory('AuthService', ['$http',
  function($http){

    var authService = {};

    authService.checkUserStatus = function(callback){
      $http({
        method: 'GET',
        url: SERVER + "/authentication_status"
      }).
      success(function(data, status, headers, config){
        callback(data);
      }).
      error(function(data, status, headers, config){
        console.log('error logging in user');
      });
    }

    return authService;

  }]);

/*******************************************************************************************************
Init Service  */

appServices.factory('InitService', ['$rootScope', 'UiState','Profile','DancecardService', 'Socket', 'NotificationService',
  function($rootScope, UiState, Profile, DancecardService, Socket, NotificationService){

         var initService = {};

         initService.initializeData = function(user, pref){

            Profile.initializeProfile(user, pref, "someurl");
            var newUser = typeof(user) == 'object' ? true : false;
            var userid = newUser ? user.userid : user;

            console.log('initialize service...');
            console.log('user' + userid);
            DancecardService.initializeDancecard(userid);
            if(!newUser){
             NotificationService.initializeNotifications(userid);
            }
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
History Test Controller  */

appControllers.controller('HistoryTestCtrl', ['$scope', '$upload', '$rootScope', '$state', 'HistoryService',
    function($scope, $upload, $rootScope, $state, HistoryService) {
      $scope.history;
      $scope.time_ago;
      $scope.output;

      $scope.getHistory = function(){
        HistoryService.getHistory(function(response){
            $scope.$apply(function(){
              $scope.history = response;
            });
            HistoryService.saveHistory(response, function(data){
              console.log('returned from saveHistory...');
              console.log(data);
            });
        });
      }

  }]);


/*******************************************************************************************************
Upload Test Controller  */

appControllers.controller('UploadTestCtrl', ['$scope', '$upload', '$rootScope', '$state',
    function($scope, $upload, $rootScope, $state) {

        $scope.largeImage = "/userId_1.jpg";
        $scope.mediumImage = "/thumb_okc_profile2.jpg";

$scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      console.log(file);
      $scope.upload = $upload.upload({
        url: SERVER + '/upload', //upload.php script, node.js route, or servlet url
        // method: POST or PUT,
        // headers: {'header-key': 'header-value'},
        // withCredentials: true,
        data: {myObj: $scope.myModelObj},
        file: file, // or list of files: $files for html5 only
        /* set the file formData name ('Content-Desposition'). Default is 'file' */
        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
        //formDataAppender: function(formData, key, val){}
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        $scope.largeImage =  "/" + file.name;
        $scope.mediumImage = "/thumb_"+ file.name;
        // $scope.mediumImage = "http://lorempixel.com/200/200/sports/";
        // console.log(data);
      });
      //.error(...)
      //.then(success, error, progress);
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
    }
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
  };

  }]);

/*******************************************************************************************************
Check Status Controller  */

appControllers.controller('CheckStatusCtrl', ['$scope', '$rootScope', '$state','UiState', 'AuthService', 'Profile', 'DancecardService', 'InitService',
  function($scope, $rootScope, $state, UiState, AuthService, Profile, DancecardService, InitService) {

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
Sign-up Controller  */

appControllers.controller('SignupCtrl', ['$scope', '$rootScope', '$state', '$upload', 'UiState', 'SignupService', 'InitService', 'Profile',
  function($scope, $rootScope, $state, $upload, UiState, SignupService, InitService, Profile) {


    // var re5digit=/^\d{5}$/ to check for 5 digit zipcode
    $scope.age_floor = 18;
    $scope.age_ceil = 80;
    $scope.distance_floor = 0;
    $scope.distance_ceil = 100;

    var current_year = new Date().getFullYear();
    var createOptions = function(start, finish, increment){
      var options = [];
          if(increment > 0){
            for(var i=start; i<= finish; i+= increment){
              options.push(i);
            }
          }
          else {
            for(var i=start; i>= finish; i+= increment){
              options.push(i);
            }
          }
          return options;
    };

    var ruleOfSeven = function(){
      var now = new Date();
      var then = new Date($scope.user.dob_year || 1980, $scope.user.dob_month-1 || 11, $scope.user.dob_day || 11);
      var diff = now - then;
      var age = Math.floor(diff/1000/60/60/8765.81)
      $scope.pref.age_min = (age/2 + 7) >= 18 ? age/2 + 7 : 18;
      $scope.pref.age_max = age + 7;
    }

    $scope.gender_options = [{name: 'Female', value: 'f'},{name: 'Male', value: 'm'}];
    $scope.day_options = createOptions(1,31,1);
    $scope.month_options = createOptions(1,12,1);
    $scope.year_options = createOptions(current_year-$scope.age_floor, current_year-$scope.age_ceil, -1);

    $scope.user = SignupService.user;
    $scope.user.username;
    $scope.user.password;
    $scope.user.email;
    //$scope.user.dob ={};
    $scope.user.dob_day;
    $scope.user.dob_month;
    $scope.user.dob_year;
    $scope.user.gender;
    $scope.user.zipcode;
    $scope.user.personal_blurb;
    $scope.user.mediumImageUrl;
    $scope.user.smallImageUrl;
    $scope.user.originalImageUrl;
    $scope.displayImage;

    $scope.pref = SignupService.pref;
    $scope.pref.male = false;
    $scope.pref.female = false;
    $scope.pref.age_max;
    $scope.pref.age_min;
    $scope.pref.distance_max = 25;

    $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      console.log(file);
      $scope.upload = $upload.upload({
        url: SERVER + '/upload', //upload.php script, node.js route, or servlet url
        // method: POST or PUT,
        // headers: {'header-key': 'header-value'},
        // withCredentials: true,
        data: {myObj: $scope.myModelObj},
        file: file, // or list of files: $files for html5 only
        /* set the file formData name ('Content-Desposition'). Default is 'file' */
        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
        //formDataAppender: function(formData, key, val){}
      }).progress(function(evt) {
        console.log('progress! ');
        console.log(evt);
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        if(!$scope.user.originalImageUrl){
          $scope.user.originalImageUrl = [];
        }
        if(!$scope.user.mediumImageUrl){
          $scope.user.mediumImageUrl = [];
        }
        if(!$scope.user.smallImageUrl){
          $scope.user.smallImageUrl = [];
        }
        $scope.displayImage = SERVER + data.medImageUrl;
        $scope.user.originalImageUrl.push(data.origImageUrl);
        $scope.user.mediumImageUrl.push(data.medImageUrl);
        $scope.user.smallImageUrl.push(data.smallImageUrl);
        // $scope.mediumImage = "http://lorempixel.com/200/200/sports/";
        console.log(data);
      });
      //.error(...)
      //.then(success, error, progress);
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
    }
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
  };

    $scope.goBack = function(){
    console.log('go back button clicked');
      $state.go(UiState.previousState.name);
    }

    $scope.beginSignup = function(){
        $state.go('sign-up-1');
        SignupService.requestInfoFromBackground('YO Yo Yo, background!');
    }

    $scope.goToSignupStep2 = function(){
        $state.go('sign-up-2');
    }

    $scope.goToSignupStep3 = function(){
        ruleOfSeven();
        $state.go('sign-up-3');
    }

    $scope.createAccount = function(){
       // $state.go('main.profileList');
       console.log('create Account!!!');
       SignupService.signupUser(function(data){
          console.log('Signing up user...');
          console.log(data);
          InitService.initializeData(data.user, data.pref);
          // Profile.getStaticProfileList(function(data){

          // });
       });
       // SignupService.requestInfoFromBackground('YO Yo Yo, background!')
          $rootScope.$broadcast('start-tutorial');
          $state.go('main.profileList', { reload: true, inherit: false, notify: false});
    }

}]);

/*******************************************************************************************************
Tutorial Controller  */

appControllers.controller('TutorialCtrl', ['$scope', '$state', 'Profile',
  function($scope, $state, Profile) {


    $scope.firstVisit = false;

    $scope.$on('start-tutorial', function(event){
      $scope.firstVisit = true;
    });

    $scope.step1 = true;
    $scope.step2 = false;
    $scope.step3 = false;

    $scope.next = function(){
      if($scope.step1){
        $scope.step1 = false;
        $scope.step2 = true;
      }
      else if($scope.step2){
        $scope.step2 = false;
        $scope.step3 = true;
      }
      else if($scope.step3){
        $scope.step3 = false;
        $scope.firstVisit = false;
        //load real data for page...
        Profile.clearPageProfiles();
        Profile.getProfilesByPage("", 10);
      }
    }

  }]);

/*******************************************************************************************************
Login Controller  */

appControllers.controller('LoginCtrl', ['$scope', '$state', 'LoginService', 'InitService', 'Socket',
  function($scope, $state, LoginService, InitService, Socket) {

    $scope.email;
    $scope.password;

    console.log(url_info);
    $scope.login = function(){
            LoginService.loginUser({email: $scope.email, password: $scope.password}, function(data){
            if(data){
              console.log('data returned from login process');
              console.log(data);
              console.log('User should be logged in...');

              InitService.initializeData(data.userid);

            $state.go('main.profileList', {reload: true, inherit: false, notify: false});
          }
        });
    }

  }]);


/*******************************************************************************************************
NotificationCtrl Controller  */

appControllers.controller('NotificationCtrl', ['$rootScope','$scope', '$state', 'UiState', 'NotificationService', 'Profile',
  function($rootScope, $scope, $state, UiState, NotificationService, Profile) {

    $scope.notifications = NotificationService.notifications;

    $scope.markRead = function(index) {
      // console.log('mark this (' + index + ') notification read');
      NotificationService.markRead(index);
    };

    $scope.isRead = function(index) {
      // console.log('you moused over ' + index + ' notification');
      return (NotificationService.notifications[index].status == 'read');
    }

    $scope.followNotificationSender = function(i){
      console.log($scope.notifications[i]);
      var notification = $scope.notifications[i];
      if(notification.type == "dancecard" && notification.subtype == "added"){
        //go to profile in details panel
        Profile.getProfileById(notification.about_userid, function(data){
          console.log('getting user from notifications...');
          console.log(data);
          Profile.selectedProfile = data[0];
          UiState.openDetailsPanel();
        })
      }

      if(notification.type == "message"){
        //go to message view for user

      }

    }

}]);

/*******************************************************************************************************
Message Controller  */

appControllers.controller('MessageCtrl', ['$scope', '$timeout', '$state', 'UiState', 'Profile', 'MessageService', 'Socket',
  function($scope, $timeout, $state, UiState, Profile, MessageService, Socket) {

    // $scope.messageThread = $scope.conversation;//inherited from DanceCardCtrl
    $scope.newMessage;
    UiState.showShortProfile = true;


    $scope.$on('$destroy', function(event){
      console.log('goodbye message controller..');
      UiState.showShortProfile = false;
    });

    $scope.ifSentByUser = function(i){
      return ($scope.conversation[i].senderid ==  Profile.selfProfile.userid)
    }

    $scope.sendMessage = function(){

      if($scope.newMessage){
        var message = {
          senderid: Profile.selfProfile.userid,
          receiverid: Profile.selectedProfile.userid,
          message: $scope.newMessage,
        }
        MessageService.sendMessageTo(message);
        $scope.newMessage = "";
      }
    }

    $scope.$watch(function () {
       return document.getElementById("messages").innerHTML;
    }, function(val) {
      scrollToBottom();
    });

    var scrollToBottom = function(){
       var element = $('#messages')[0];
       //console.log(element.scrollHeight);

       if( (element.offsetHeight < element.scrollHeight)){
         var valueToScroll = element.scrollHeight;
         $("#messages").scrollTop(valueToScroll);
          //element.scrollHeight - element.offsetHeight;
       }
     }
  }]);


/*******************************************************************************************************
TopMenuCtrl Controller  */

appControllers.controller('TopMenuCtrl', ['$rootScope','$scope', '$state', '$timeout', '$http', 'UiState', 'Socket', 'Profile', 'NotificationService', 'DancecardService',
  function($rootScope, $scope, $state, $timeout, $http, UiState, Socket, Profile, NotificationService, DancecardService) {

  $scope.username = Profile.selfProfile.username;
  $scope.ns = NotificationService;

  console.log('top menu: checking on notification service read count...');
  console.log(NotificationService);
  console.log($scope.ns.unreadCount);

  Socket.on('new-notification', function(data){
    console.log('received new notification...');
    console.log(data);
    NotificationService.addNotification(data);

    if(data.type == 'dancecard'){
      if(data.subtype == 'mutual'){
        console.log("It's a match!...");
        DancecardService.setMutual(data.about_userid);
      }
      else if(data.subtype == 'added'){
        DancecardService.addInterestedPerson(data.about_userid);
      }
      else if(data.subtype == 'removed'){
        DancecardService.noLongerInterested(data.about_userid);
      }
    }
  });

  $scope.$on('user-data-available', function(event){
    // console.log('username is ready to render! ');
    $scope.username = Profile.selfProfile.username;
  });

  $scope.logout = function(){
      $http({
          method: 'GET',
          url: SERVER + '/logout'
        }).
        success(function(data, status, headers, config){
          // callback(data);
          if(UiState.showDetailsPanel){
            UiState.closeDetailsPanel();
            $timeout(function(){
              Profile.selfProfile = {};
               $state.go('login');
            }, 1000);
          }
          else{
            Profile.selfProfile = {};
            $state.go('login');
          }

        }).
        error(function(data, status, headers, config){
          console.log('error logging out user');
        });

  }

  $scope.isSignedIn = function(){
    // console.log("is signed in...");
    // console.log(Profile.selfProfile);
    // console.log(Profile.selfProfile ? true : false);
    return Profile.selfProfile.userid ? true : false;
    // return UiState.signedIn;
  }

  $scope.goBack = function(){
    UiState.showShortProfile = false;
    $state.go('main.profileList');
    // $state.go(UiState.previousState.name);
  }

  $scope.goToProfile = function(){
      // console.log('opening personal profile in details panel, state? current and past');
      // console.log(UiState.currentState);
      // console.log(UiState.previousState);
      console.log('show short profile state....');
      console.log(UiState.showShortProfile);
      if(UiState.currentState.name == 'main.messages'){
        UiState.showShortProfile = true;
      }
      UiState.selectProfile(Profile.selfProfile, 'self') ? UiState.closeDetailsPanel() : UiState.openDetailsPanel();
      console.log('show short profile state....');
      console.log(UiState.showShortProfile);
    }

  $scope.goToNotifications = function(){
    $state.go('main.notifications');
  }

  $scope.goToHistory = function(){
    $state.go('main.history-test');
  }

}]);
/*******************************************************************************************************
Dancecard Controller  */

appControllers.controller('DanceCardCtrl', ['$rootScope','$scope', '$state', '$timeout', 'UiState', 'MessageService', 'DancecardService', 'Socket', 'Profile',
  function($rootScope, $scope, $state, $timeout, UiState, MessageService, DancecardService, Socket, Profile) {

    // DancecardService.getStaticDancecard(function(data){
    //     $scope.danceCard = data;
    // });

    // console.log("Uistate in dancecard controller...");
    // console.log(UiState);


    Socket.on('new-message', function(data){
      console.log('new messsage received...');
      console.log(data);
      // $scope.conversation.push(data);
      MessageService.updateConversationWith(data.senderid, data);
    });

    $scope.onDropAdd = function(event, data){
      console.log('item dropped...');
      console.log(data);
      console.log(event);

      Profile.selectedProfile = data;
      updateDancecard(data.userid, 'added');

    }

    function updateDancecard(userid, status){
      var data = {
        userid: Profile.selfProfile.userid,
        partnerid: userid,
        status: status
      }

      if(status == 'added'){
        //remove list select indicator when selecting person from dancecard
            $('.select-indicator').css('visibility', 'hidden');
            $('.select-indicator').css('right', '7px');
         DancecardService.updateDancecard(data, Profile.selectedProfile);
      }

      if(status == 'removed'){
            UiState.showDetailsPanel = false;
            // $state.go('main.profileList');
            $state.go('main.removeSurvey');
      }
    };

    $scope.$on('dancecard-update', function(event){
      $scope.dancecard = DancecardService.dancecard;
    });

   $scope.$on('dancecard-available', function(event){
    $scope.dancecard = DancecardService.dancecard;
   });

    $scope.selectOnly = function(i){

        var closeDetails;
        if($scope.dancecard[i].userid != -1){
          $scope.selectedProfile = $scope.dancecard[i];
          closeDetails = UiState.selectProfile($scope.dancecard[i], 'dancecard');
          if($scope.dancecard[i].mutual){
            UiState.showShortProfile = true;
            !closeDetails ? UiState.closeDetailsPanel() : UiState.openDetailsPanel();
            $scope.conversation = [];
            MessageService.getConversationWith(Profile.selectedProfile.userid);
            $state.go('main.messages');

            //MessageService.getMessageByuserid(UiState.selectedProfile.userid);
            // getConversation(Profile.selectedProfile.userid);
          }
          else {
             $( "#detailsContent" ).addClass('dancecard');
            closeDetails ? UiState.closeDetailsPanel() : UiState.openDetailsPanel();
            $state.go('main.profileList');
          }
        }
      }

      $scope.$on('conversation-available', function(event, data){
        console.log('conversation is available...');
        console.log(data);
        // $scope.$apply(function(){
          $scope.conversation = data;
        // })
      })

      // var getConversation = function(userid){
      //   // MessageService.getStaticMessageByuserid(userid, function(data){
      //   //   $scope.conversation = data;
      //   // });
      //    MessageService.getMessageByuserid(userid, function(data){
      //     $scope.conversation = data;
      //   });
      // }

      $scope.showDetailedProfile = function(){
        // UiState.showDetailsPanel = true;
        UiState.openDetailsPanel();
      }

      $scope.ifSelected = function(i){
        return (Profile.selectedProfile.userid == $scope.dancecard[i].userid && $scope.dancecard[i].userid != -1);
      }

      $scope.isMutual = function(i){
        return ($scope.dancecard[i].mutual);
      }

      $scope.isNotPlaceholder = function(i){
        console.log('isnotplaceholder?');
        console.log($scope.dancecard[i].userid);
        return ($scope.dancecard[i].userid != -1);
      }

    $scope.conversation = [];
    $scope.uiState = UiState;
    $scope.selectedProfile = {}

  }]);

/*******************************************************************************************************
Profile List Controller  */

appControllers.controller('ProfileListCtrl', ['$scope', '$rootScope', '$timeout', 'Profile', 'UiState',
  function($scope, $rootScope, $timeout, Profile, UiState) {

    $scope.profiles = Profile.pageProfiles;

    $scope.$on('page-profiles-available', function(event){
      $scope.profiles = Profile.pageProfiles;
    });

    $scope.ifSelected = function(i){
      return (UiState.showDetailsPanel && Profile.selectedProfile.userid == $scope.profiles[i].userid);
    }

    $scope.selectOnly = function(i){
      UiState.selectProfile($scope.profiles[i], 'list') ? UiState.closeDetailsPanel() : UiState.openDetailsPanel();

    }

  }]);

/*******************************************************************************************************
Remove surveyController  */

appControllers.controller('RemoveSurveyCtrl', ['$scope', '$state', 'Profile', 'UiState', 'DancecardService',
  function($scope, $state, Profile, UiState, DancecardService) {

    $scope.survey;
    $scope.username = Profile.selectedForRemoval.username;

    $scope.cancel = function(){
      // UiState.showDetailsPanel = false;
      $state.go('main.profileList');
    }


    $scope.submitSurvey = function(){
      var data = {
        userid: Profile.selfProfile.userid,
        partnerid: Profile.selectedForRemoval.userid,
        status: 'removed'
      };
      DancecardService.updateDancecard(data, Profile.selectedForRemoval);
      // UiState.showDetailsPanel = false;
      $state.go('main.profileList');
    }

    }]);

/*******************************************************************************************************
Profile Detail Controller  */

appControllers.controller('ProfileDetailCtrl', ['$rootScope', '$scope', '$state', 'Profile', 'UiState','DancecardService', 'InterestService', 'SharedInterestService',
  function($rootScope, $scope, $state, Profile, UiState, DancecardService, InterestService, SharedInterestService) {

    // $scope.profile = Profile;
    $scope.profile;
    $scope.treemapData;
    $scope.sharedInterestData;
    $scope.slideIndex;

    $scope.$on('profile-selected', function(event){

      $scope.profile = Profile;
      // console.log('in profiledetail ctrl...checking select userid');
      // console.log($scope.profile.selectedProfile.userid);
      // console.log(Profile);
      // console.log(Profile.selectProfile);
      slideIndex = 0;
      InterestService.usersTreemap(Profile.selectedProfile.userid, function(data){
          $scope.treemapData = data;
      });

      SharedInterestService.sharedInterests(Profile.selectedProfile.userid, function(data){
        $scope.sharedInterestData = data;
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
            embedTag = tagDiv[0].outerHTML
          }
          data[i].embed_tag = embedTag;
        }
      });
    });

    $scope.prev = function() {
        $scope.slideIndex--;
    }
    $scope.next = function() {
        $scope.slideIndex++;
    }

    //  $scope.$on('treemap-data-available', function(event){

    //   console.log('in profiledetail ctrl...treemap data...');
    //   $scope.treemapData = InterestService.treemapData;
    // });

    $scope.showAddButton = function(){
      return (!isInDanceCard(Profile.selectedProfile.userid) && !isDancecardFilled() && !$scope.isSelf());
    }

    $scope.showRemoveButton = function(){
      return (isInDanceCard(Profile.selectedProfile.userid) && !$scope.isSelf());
    }

    $scope.showMessageButton = function(){
      return (isMutual(Profile.selectedProfile.userid) && !$scope.isSelf());
    }

    var isInDanceCard = function(userid){

      for(var i=0; i<DancecardService.dancecard.length; i++) {
        if(DancecardService.dancecard[i].userid == userid){
          return true;
        }
      };
      return false;
    };

    var isMutual = function(userid){
      for(var i=0; i<DancecardService.dancecard.length; i++) {
        if(DancecardService.dancecard[i].userid == userid){
          return DancecardService.dancecard[i].mutual;
        }
      };
      return false;
    }

    var isDancecardFilled = function(){
      return (DancecardService.isDancecardFilled());
    }

    $scope.isSelf = function(){
      return (Profile.selectedProfile.userid == Profile.selfProfile.userid);
    }

    $scope.updateDancecard = function(user, status){
      var data = {
        userid: Profile.selfProfile.userid,
        partnerid: user.userid,
        status: status
      }

      if(status == 'added'){
         DancecardService.updateDancecard(data, user);
      }

      if(status == 'removed'){
            Profile.selectedForRemoval = user;
            UiState.showDetailsPanel = false;
            // $state.go('main.profileList');
            $state.go('main.removeSurvey');
      }
    };
  }]);

/*******************************************************************************************************
Ui Controller  */

appControllers.controller('uiCtrl', ['$rootScope', '$scope', '$timeout', '$state', 'UiState', 'Profile', 'DancecardService',
  function($rootScope, $scope, $timeout, $state, UiState, Profile, DancecardService){
    var arrowLeftIconURL = chrome.extension.getURL("icons/icon_22996/icon_22996.png");
    var arrowRightIconURL = chrome.extension.getURL("icons/icon_22997/icon_22997.png");

    $scope.uiState = UiState;

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

      switch(message.type) {
        case "close-sidebar":
        console.log('close message received in app...');

          UiState.shutdown();
          chrome.runtime.onMessage.removeListener(arguments.callee);

          console.log($scope.uiState);
          break;
      }
    });

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
       //assign the "from" parameter to something
       // console.log('pervious state...');
       // console.log(from);
       UiState.previousState = from;
       UiState.currentState = to;
    });

    $scope.tabAction = function(){
      // console.log($scope.uiState.tabIconUrl);
      console.log('show sidebar? ' + $scope.uiState.showSidebar);
      console.log('show details panel? ' + $scope.uiState.showDetailsPanel);
      if($scope.uiState.showSidebar){//if sidebar is open
        if($scope.uiState.showDetailsPanel){//if details panel is open
            UiState.closeDetailsPanel();//close details panel
        }
        else{
          UiState.closeSidebar();
          // $scope.uiState.showSidebar = false;
          //$scope.uiState.tabIconUrl = arrowLeftIconURL;
          $("#arrow-icon").attr("src", arrowLeftIconURL);
        }
      }
      else{
        UiState.openSidebar();
        $("#arrow-icon").attr("src", arrowRightIconURL);

      }
    }

    // $scope.showRemove = false;

    $rootScope.$on('ANGULAR_DRAG_START', function (event, channel) {
      console.log('drag started on dancecard....');
      //listen for "remove-person" channel
      //onoly do stuff with that channel

        console.log(event);
        console.log(channel);
        if(channel == 'remove-person'){
          $scope.$apply(function(){
                $scope.showRemove = true;
              });
        }
    });

    $rootScope.$on('ANGULAR_DRAG_END', function (event, channel) {
      console.log('drag ended on dancecard....');
      //listen for "remove-person" channel
      //onoly do stuff with that channel
      if(channel == 'remove-person'){
        $scope.$apply(function(){
            $scope.showRemove = false;
          });
      }
    });


    $scope.onDropRemove = function(event, data) {
      console.log('dropping to remove user from dancecard...');
      console.log(event);
      console.log(data);
      $scope.showRemove = false;
      removeFromDancecard(data);
    }

    function removeFromDancecard(user){

      if(user.userid != -1){
        if(Profile.selectedProfile.userid == user.userid){
            UiState.showDetailsPanel = false;
        }
              // $state.go('main.profileList');
        Profile.selectedForRemoval = user;
         $state.go('main.removeSurvey');
       }
       else{
        console.log('cannot remove placeholder user...');
       }
    };



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
