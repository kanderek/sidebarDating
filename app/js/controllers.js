'use-strict';

var appControllers = angular.module('appControllers', []);

// /*******************************************************************************************************
// Upload Test Controller  */

// .controller('UploadTestCtrl', ['$scope', '$upload', '$rootScope', '$state',
//     function($scope, $upload, $rootScope, $state) {

//         $scope.largeImage = "http://localhost:3000/userId_1.jpg";
//         $scope.mediumImage = "http://localhost:3000/thumb_okc_profile2.jpg"; 

// $scope.onFileSelect = function($files) {
//     //$files: an array of files selected, each file has name, size, and type.
//     for (var i = 0; i < $files.length; i++) {
//       var file = $files[i];
//       console.log(file);
//       $scope.upload = $upload.upload({
//         url: 'http://localhost:3000/upload', //upload.php script, node.js route, or servlet url
//         // method: POST or PUT,
//         // headers: {'header-key': 'header-value'},
//         // withCredentials: true,
//         data: {myObj: $scope.myModelObj},
//         file: file, // or list of files: $files for html5 only
//         /* set the file formData name ('Content-Desposition'). Default is 'file' */
//         //fileFormDataName: myFile, //or a list of names for multiple files (html5).
//         /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
//         //formDataAppender: function(formData, key, val){}
//       }).progress(function(evt) {
//         console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
//       }).success(function(data, status, headers, config) {
//         // file is uploaded successfully
//         $scope.largeImage = "http://localhost:3000/" + file.name;
//         $scope.mediumImage = "http://localhost:3000/thumb_"+ file.name; 
//         // $scope.mediumImage = "http://lorempixel.com/200/200/sports/";
//         // console.log(data);
//       });
//       //.error(...)
//       //.then(success, error, progress); 
//       //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
//     }
//     /* alternative way of uploading, send the file binary with the file's content-type.
//        Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
//        It could also be used to monitor the progress of a normal http post/put request with large data*/
//     // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
//   };

//   }])

// /*******************************************************************************************************
// Check Status Controller  */

// .controller('CheckStatusCtrl', ['$scope', '$rootScope', '$state','UiState', 'AuthService', 'Profile', 'DancecardService', 'InitService',
//   function($scope, $rootScope, $state, UiState, AuthService, Profile, DancecardService, InitService) {

//     AuthService.checkUserStatus(function(data){
//       console.log(data);
//       if(data.status == "logged_in"){
//         InitService.initializeData(data.userid);
//         $state.go('main.profileList');
//       }
//       else if(data.status == "logged_out"){
//         $state.go('sign-up-0');
//       }
//     });

//   }])

// /*******************************************************************************************************
// Sign-up Controller  */

// .controller('SignupCtrl', ['$scope', '$state', '$upload', 'UiState', 'SignupService', 'InitService',
//   function($scope, $state, $upload, UiState, SignupService, InitService) {

//     $scope.age_floor = 18;
//     $scope.age_ceil = 80;
//     $scope.distance_floor = 0;
//     $scope.distance_ceil = 100;

//     var current_year = new Date().getFullYear();
//     var createOptions = function(start, finish, increment){
//       var options = [];
//           if(increment > 0){
//             for(var i=start; i<= finish; i+= increment){ 
//               options.push(i);
//             }
//           }
//           else {
//             for(var i=start; i>= finish; i+= increment){ 
//               options.push(i);
//             }
//           }
//           return options;
//     };

//     var ruleOfSeven = function(){
//       var now = new Date();
//       var then = new Date($scope.user.dob_year || 1980, $scope.user.dob_month-1 || 11, $scope.user.dob_day || 11);
//       var diff = now - then;
//       var age = Math.floor(diff/1000/60/60/8765.81)
//       $scope.pref.age_min = (age/2 + 7) >= 18 ? age/2 + 7 : 18;
//       $scope.pref.age_max = age + 7;
//     }

//     $scope.gender_options = [{name: 'Female', value: 'f'},{name: 'Male', value: 'm'}];
//     $scope.day_options = createOptions(1,31,1);
//     $scope.month_options = createOptions(1,12,1);
//     $scope.year_options = createOptions(current_year-$scope.age_floor, current_year-$scope.age_ceil, -1);

//     $scope.user = SignupService.user;
//     $scope.user.username;
//     $scope.user.password;
//     $scope.user.email;
//     //$scope.user.dob ={};
//     $scope.user.dob_day;
//     $scope.user.dob_month;
//     $scope.user.dob_year;
//     $scope.user.gender;
//     $scope.user.zipcode;
//     $scope.user.personal_blurb;
//     $scope.user.mediumImageUrl;
//     $scope.user.smallImageUrl;
//     $scope.user.originalImageUrl;

//     $scope.pref = SignupService.pref;
//     $scope.pref.male = false;
//     $scope.pref.female = false;
//     $scope.pref.age_max;
//     $scope.pref.age_min;
//     $scope.pref.distance_max = 25;

//     $scope.onFileSelect = function($files) {
//     //$files: an array of files selected, each file has name, size, and type.
//     for (var i = 0; i < $files.length; i++) {
//       var file = $files[i];
//       console.log(file);
//       $scope.upload = $upload.upload({
//         url: 'http://localhost:3000/upload', //upload.php script, node.js route, or servlet url
//         // method: POST or PUT,
//         // headers: {'header-key': 'header-value'},
//         // withCredentials: true,
//         data: {myObj: $scope.myModelObj},
//         file: file, // or list of files: $files for html5 only
//         /* set the file formData name ('Content-Desposition'). Default is 'file' */
//         //fileFormDataName: myFile, //or a list of names for multiple files (html5).
//         /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
//         //formDataAppender: function(formData, key, val){}
//       }).progress(function(evt) {
//         console.log('progress! ');
//         console.log(evt);
//         console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
//       }).success(function(data, status, headers, config) {
//         // file is uploaded successfully
//         if(!$scope.user.originalImageUrl){
//           $scope.user.originalImageUrl = [];
//         }
//         if(!$scope.user.mediumImageUrl){
//           $scope.user.mediumImageUrl = [];
//         }
//         if(!$scope.user.smallImageUrl){
//           $scope.user.smallImageUrl = [];
//         }
//         $scope.user.originalImageUrl.push(data.origImageUrl);
//         $scope.user.mediumImageUrl.push(data.medImageUrl); 
//         $scope.user.smallImageUrl.push(data.smallImageUrl);
//         // $scope.mediumImage = "http://lorempixel.com/200/200/sports/";
//         console.log(data);
//       });
//       //.error(...)
//       //.then(success, error, progress); 
//       //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
//     }
//     /* alternative way of uploading, send the file binary with the file's content-type.
//        Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
//        It could also be used to monitor the progress of a normal http post/put request with large data*/
//     // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
//   };

//     $scope.beginSignup = function(){
//         $state.go('sign-up-1');
//     }

//     $scope.goToSignupStep2 = function(){
//         $state.go('sign-up-2');
//     }

//     $scope.goToSignupStep3 = function(){
//         ruleOfSeven();
//         $state.go('sign-up-3');
//     }

//     $scope.createAccount = function(){
//        // $state.go('main.profileList');
//        SignupService.signupUser(function(data){
//           console.log('Signing up user...');
//           console.log(data);
//           InitService.initializeData(data.user);
//        });
//        $state.go('main.profileList', { reload: true, inherit: false, notify: false});
//     }

// }])

/*******************************************************************************************************
Login Controller  */

appControllers.controller('LoginCtrl', ['$scope', '$state',  'LoginService', 'InitService',
  function($scope, $state, LoginService, InitService) {

    $scope.email;
    $scope.password;

    // console.log(url_info);
    $scope.login = function(){
        LoginService.loginUser({email: $scope.email, password: $scope.password}, function(data){
          if(data){ 
            InitService.initializeData(data.userid);
            $state.go('main.profileList', {reload: true, inherit: false, notify: false});
          }
        });
    }

  }]);


// /*******************************************************************************************************
// NotificationCtrl Controller  */

// .controller('NotificationCtrl', ['$rootScope','$scope', '$state', 'UiState', 'NotificationService',
//   function($rootScope, $scope, $state, UiState, NotificationService) {

//     $scope.notifications = NotificationService.notifications;

//     $scope.markRead = function(index) {
//       console.log('mark this (' + index + ') notification read');
//       NotificationService.markRead(index);
//     };
    
//     $scope.isRead = function(index) {
//       console.log('you moused over ' + index + ' notification');
//       return (NotificationService.notifications[index].status == 'read');
//     }

// }])

// /*******************************************************************************************************
// Message Controller  */

// .controller('MessageCtrl', ['$scope', '$timeout', '$state', 'UiState', 'Profile', 'MessageService', 'Socket',
//   function($scope, $timeout, $state, UiState, Profile, MessageService, Socket) {

//     $scope.messageThread = $scope.conversation;//inherited from DanceCardCtrl
//     $scope.newMessage;

//     console.log($scope.conversation);
//     $scope.ifSentByUser = function(i){
//       return ($scope.conversation[i].senderid ==  Profile.selfProfile.userid)
//     }

//     $scope.sendMessage = function(){

//       if($scope.newMessage){
//         var message = {
//           senderid: Profile.selfProfile.userid,
//           receiverid: Profile.selectedProfile.userid,
//           message: $scope.newMessage,
//         }
//         $scope.conversation.push(message);
//         MessageService.sendMessageTouserid(message, function(data){
//           //post response data?
//           // console.log('post of message a success');
//         });
//         $scope.newMessage = "";
//       }
//     }

//     $scope.$watch(function () {
//        return document.getElementById("messages").innerHTML;
//     }, function(val) {
//       scrollToBottom();
//     });

//     var scrollToBottom = function(){
//        var element = $('#messages')[0];
//        //console.log(element.scrollHeight);
         
//        if( (element.offsetHeight < element.scrollHeight)){
//          var valueToScroll = element.scrollHeight;
//          $("#messages").scrollTop(valueToScroll);
//           //element.scrollHeight - element.offsetHeight;
//        }
//      }
//   }])


// /*******************************************************************************************************
// TopMenuCtrl Controller  */

// .controller('TopMenuCtrl', ['$rootScope','$scope', '$state', 'UiState', 'Socket', 'Profile', 'NotificationService', 'DancecardService',
//   function($rootScope, $scope, $state, UiState, Socket, Profile, NotificationService, DancecardService) {

//   $scope.username = Profile.selfProfile.username;
//   $scope.ns = NotificationService;

//   console.log('top menu: checking on notification service read count...');
//   console.log(NotificationService);
//   console.log($scope.ns.unreadCount);

//   Socket.on('new-notification', function(data){
//     console.log('received new notification...');
//     console.log(data);
//     NotificationService.addNotification(data);
    
//     if(data.type == 'dancecard'){
//       if(data.subtype == 'mutual'){
//         console.log("It's a match!...");
//         DancecardService.setMutual(data.about_userid); 
//       }
//       else if(data.subtype == 'added'){
//         DancecardService.addInterestedPerson(data.about_userid);
//       }
//       else if(data.subtype == 'removed'){
//         DancecardService.noLongerInterested(data.about_userid);
//       }
//     }
//   });

//   $scope.$on('user-data-available', function(event){
//     // console.log('username is ready to render! ');
//     $scope.username = Profile.selfProfile.username;
//   });

//   $scope.isSignedIn = function(){
//     return true;
//   }

//   $scope.goBack = function(){
//     $state.go('main.profileList');
//   }

//   $scope.goToProfile = function(){
//       if(Profile.selectedProfile != Profile.selfProfile){
//         Profile.selectedProfile = Profile.selfProfile;
//       }
//       UiState.showDetailsPanel = true;
//     }

//   $scope.goToNotifications = function(){
//     $state.go('main.notifications');
//   }

// }])
// /*******************************************************************************************************
// Dancecard Controller  */

// .controller('DanceCardCtrl', ['$rootScope','$scope', '$state', 'UiState', 'MessageService', 'DancecardService', 'Socket', 'Profile',
//   function($rootScope, $scope, $state, UiState, MessageService, DancecardService, Socket, Profile) {
    
//     // DancecardService.getStaticDancecard(function(data){
//     //     $scope.danceCard = data;
//     // });
  
//     // console.log("Uistate in dancecard controller...");
//     // console.log(UiState);
    

//     Socket.on('new-message', function(data){
//       console.log('new messsage received...');
//       console.log(data);
//       $scope.conversation.push(data);
//     });


//     $scope.$on('dancecard-update', function(event){
//       $scope.dancecard = DancecardService.dancecard;
//     });

//      $scope.$on('dancecard-available', function(event){
//       $scope.dancecard = DancecardService.dancecard;
//       });


//     $scope.selectOnly = function(i){
//         if($scope.dancecard[i].userid != -1){
//           Profile.selectedProfile = $scope.dancecard[i];
//           $scope.selectedProfile = $scope.dancecard[i];
//           $scope.showShortProfile = true;
//           if($scope.dancecard[i].mutual){
//             $state.go('main.messages');
//             //MessageService.getMessageByuserid(UiState.selectedProfile.userid);
//             getConversation(Profile.selectedProfile.userid);
//           }
//         }
//       }

//       var getConversation = function(userid){
//         // MessageService.getStaticMessageByuserid(userid, function(data){
//         //   $scope.conversation = data;
//         // });
//         MessageService.getMessageByuserid(userid, function(data){
//           $scope.conversation = data;
//         });
//       }

//       $scope.showDetailedProfile = function(){
//         UiState.showDetailsPanel = true;
//       }

//       $scope.ifSelected = function(){
//         return (Profile.selectedProfile.userid == $scope.selectedProfile.userid && $scope.selectedProfile != -1);
//       }

//       $scope.isMutual = function(i){
//         return ($scope.dancecard[i].mutual);
//       }

//     $scope.conversation = [];
//     $scope.showShortProfile = false;
//     $scope.selectedProfile = -1;

//   }])

// /*******************************************************************************************************
// Profile List Controller  */

// .controller('ProfileListCtrl', ['$scope', 'Profile', 'UiState',
//   function($scope, Profile, UiState) {

//     $scope.profiles = Profile.pageProfiles;
    
//     $scope.$on('page-profiles-available', function(event){
//       $scope.profiles = Profile.pageProfiles;
//     });

//     $scope.selectOnly = function(i){
//       UiState.showDetailsPanel = true;
//       Profile.selectedProfile = $scope.profiles[i];
//     }

//     $scope.ifSelected = function(i){
//       return (UiState.showDetailsPanel && Profile.selectedProfile.userid == $scope.profiles[i].userid);
//     }

//     // $scope.orderProp = 'username'; does not sort UiState.pageProfiles so indexes are out of sync, don't use for now.

//   }])

// /*******************************************************************************************************
// Profile List Controller  */

// .controller('RemoveSurveyCtrl', ['$scope', '$state', 'Profile', 'UiState', 'DancecardService',
//   function($scope, $state, Profile, UiState, DancecardService) {

//     $scope.survey;

//     $scope.cancel = function(){
//       UiState.showDetailsPanel = false;
//       $state.go('main.profileList');
//     }
    

//     $scope.submitSurvey = function(){
//       var data = {
//         userid: Profile.selfProfile.userid,
//         partnerid: Profile.selectedProfile.userid,
//         status: 'removed'
//       };
//       DancecardService.updateDancecard(data, Profile.selectedProfile);
//       UiState.showDetailsPanel = false;
//       $state.go('main.profileList');
//       console.log('you just removed ' + Profile.selectedProfile.username);
//     }

//     }])

// /*******************************************************************************************************
// Profile Detail Controller  */

// .controller('ProfileDetailCtrl', ['$rootScope', '$scope', '$state', 'Profile', 'UiState','DancecardService',
//   function($rootScope, $scope, $state, Profile, UiState, DancecardService) {

//     $scope.profile = Profile;

//     $scope.showAddButton = function(){
//       return (!isInDanceCard(Profile.selectedProfile.userid) && !isDancecardFilled() && !$scope.isSelf());
//     }

//     $scope.showRemoveButton = function(){
//       return (isInDanceCard(Profile.selectedProfile.userid) && !$scope.isSelf());
//     }

//     $scope.showMessageButton = function(){
//       return (isMutual(Profile.selectedProfile.userid) && !$scope.isSelf());
//     }

//     var isInDanceCard = function(userid){

//       for(var i=0; i<DancecardService.dancecard.length; i++) {
//         if(DancecardService.dancecard[i].userid == userid){
//           return true;
//         }
//       };
//       return false; 
//     };

//     var isMutual = function(userid){
//       for(var i=0; i<DancecardService.dancecard.length; i++) {
//         if(DancecardService.dancecard[i].userid == userid){
//           return DancecardService.dancecard[i].mutual;
//         }
//       };
//       return false; 
//     }

//     var isDancecardFilled = function(){
//       return (DancecardService.isDancecardFilled());
//     }

//     $scope.isSelf = function(){
//       return (Profile.selectedProfile.userid == Profile.selfProfile.userid);
//     }

//     $scope.updateDancecard = function(userid, status){
//       var data = {
//         userid: Profile.selfProfile.userid,
//         partnerid: userid,
//         status: status
//       }

//       if(status == 'added'){
//          DancecardService.updateDancecard(data, Profile.selectedProfile);
//       }

//       if(status == 'removed'){
//             UiState.showDetailsPanel = false;
//             // $state.go('main.profileList');
//             $state.go('main.removeSurvey');
//       }

//     };
//   }])

// /*******************************************************************************************************
// Ui Controller  */

// .controller('uiCtrl', ['$rootScope', '$scope', 'UiState', 'Profile', 'DancecardService',
//   function($rootScope, $scope, UiState, Profile, DancecardService){
//     var arrowLeftIconURL = chrome.extension.getURL("icons/icon_22996/icon_22996.png");
//     var arrowRightIconURL = chrome.extension.getURL("icons/icon_22997/icon_22997.png");

//     $scope.uiState = UiState;
//     $scope.uiState.showSidebar = true;

//     $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
//        //assign the "from" parameter to something
//        console.log('pervious state...');
//        console.log(from);
//     });

//     $scope.tabAction = function(){
//       console.log($scope.uiState.tabIconUrl);
//       if($scope.uiState.showSidebar){
//         if($scope.uiState.showDetailsPanel){
//           $scope.uiState.showDetailsPanel = false;
//         }
//         else{
//           $scope.uiState.showSidebar = false;
//           //$scope.uiState.tabIconUrl = arrowLeftIconURL;
//           $("#arrow-icon").attr("src", arrowLeftIconURL);
//         }
//       }
//       else{
//         $scope.uiState.showSidebar = true;
//         $("#arrow-icon").attr("src", arrowRightIconURL);

//       }
//     }
//   }]);

