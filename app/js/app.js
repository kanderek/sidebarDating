'use-strict';

angular.module('sidebarDatingExt',[
  'vr.directives.slider',
  'angular-carousel',
  'angularFileUpload',
  'ui.router',
  'appControllers',
  'appServices'
])

.config(['$sceDelegateProvider', '$stateProvider', '$sceProvider',
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
