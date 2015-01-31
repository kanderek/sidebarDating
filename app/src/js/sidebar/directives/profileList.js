angular.module('profileListDirective', ['appServices2', 'ngDragDrop'])
    .directive('profileList', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/profileList.html',
            scope: {
              selected: '=',
              userid: '@'
            },
            link: link,
            controller: 'profileListController',
            controllerAs: 'plc'
        };
    }])
    .controller('profileListController', ['$scope', 'Profile', function ($scope, Profile) {

      var _this = this;

      this.MAX_PROFILES = 7;

      Profile.getProfilesByPage('https://www.google.com/', 8, $scope.userid)
        .then(function (profiles) {

          profiles.forEach(function (profile) {
            profile.small_image_url = profile.smallimageurls[0];
          });

          _this.profiles = profiles;
        });

      // Profile.getStaticProfileList('f')
      //   .then(function (profiles) {
      //     _this.profiles = profiles;
      //   });

      // Profile.getStaticProfileList('m')
      //   .then(function (fringes) {
      //     _this.fringes = fringes;
      //   });

      $scope.ifSelected = function (userid) {
        if ($scope.selected) {
          return $scope.selected.userid === userid;
        }
        return false;
      };

      $scope.select = function () {
        $scope.selected = this.profile;
      };
      
    }]);


