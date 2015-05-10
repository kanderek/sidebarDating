var sidebarController = [
        '$rootScope',
        '$scope',
        '$location',
        'Iframe',
        'DancecardService',

    function ($rootScope, $scope, $location, Iframe, DancecardService) {

        $scope.urls = {
            signupUrl: '/testing/signup',
            homeUrl: '/testing/home',
            messageUrl: '/testing/message',
            notificationsUrl: '/testing/notification',
            settingsUrl: '/testing/login',
            removeSurvey: '/testing/survey',
            loginUrl: '/testing/login'
        };

        $scope.userData = {
            // userid: 23,
        //  username: 'some name',
            // unread_notifications: 26,
            // dancecard_spots: 0,
            // selected_user: {
            //  origin: null,
            //  userid: 2,
            //  username: 'Bobby G.',
            //  age: 27,
            //  location_city: 'Oakland',
            //  location_state: 'CA',
            //  small_image_url: 'http://localhost:3000/small_tutorial5f.jpg',
            //  profile_image_urls: [],
            //  personal_blurb: 'What up cuties!',
            //  dancecard_spots: 3,
            //  in_dancecard: true,
            //  mutual: true,
            //  interested: false,
            //  logged_in: false
            // }
        };

        $rootScope.$on('user-logged-in', function (event, userData) {
            $scope.userData = userData;
        });

        $rootScope.$on('user-logged-out', function (event) {
            $scope.userData = {};
            // Clean up data
                // dancecard?
                // notificatoins?
                // pageProfiles?
        });

        $scope.$watch(function ($scope) {
            return $scope.userData.selected_user;
        }, onUserSelected, true);

        function onUserSelected(selectedUser) {
            if (selectedUser && !_.isEmpty(selectedUser)) {
                console.log('user changed... to ' + selectedUser.userid);
                Iframe.showProfile(selectedUser);
            }
        }

        Iframe.onMessage('openMessages', function (userid) {
            console.log('open messages with ' + userid);
            $scope.$apply(function () {
                $location.url($scope.urls.messageUrl);
            });
        });

        Iframe.onMessage('addToDancecard', function (userid) {
            console.log('add ' + userid + ' to dancecard');
        });

        Iframe.onMessage('removeFromDancecard', function (userid) {
            console.log('remove ' + userid + ' from dancecard');
        });
    }
]