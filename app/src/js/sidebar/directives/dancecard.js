angular.module('myDancecardDirective', ['appServices', 'ngDragDrop'])
    .directive('myDancecard', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/dancecard.html',
            scope: {
              userid: '@',
              selected: '=',
              selectUrl: '@'
            },
            link: link,
            controller: 'dancecardController',
            controllerAs: 'ctrl2'
        };
    }])
    .controller('dancecardController',
      [
        '$rootScope',
        '$scope',
        '$location',
        'DancecardService',

        function ($rootScope, $scope, $location, DancecardService) {

            var placeholderImage = '';
            var _this = this;

            this.MAX_MEMBERS = 5;

            // DancecardService.getStaticDancecard()
            //   .then(function (members) {
            //     _this.members = members;
            //     _this.updatePlaceholders();
            //   });

            // $rootScope.$on('user-logged-in', function () {
            //     initialize();
            // });

            function initialize() {
                DancecardService.getDancecardById($scope.userid)
                .then(function (members) {
                    _this.members = members;
                    _this.updatePlaceholders();
                });
            }

            this.updatePlaceholders = function () {
              this.placeholders = [];

              for (var i=this.members.length; i < this.MAX_MEMBERS; i++) {
                this.placeholders.push({image_url: 'https://localhost:4443/icons/icon_15724/icon_15724.png'});
              }
            };

            $scope.addToDancecard = function (event, data) {
              console.log('user ' + data.userid + ' addedToDancecard');
              DancecardService.addToDancecard($scope.userid, data.userid)
                .then(function (dancecard) {
                    _this.members = dancecard;
                    _this.updatePlaceholders();
                });
            };

            $scope.isSelected = function () {
              return !!$scope.selected;
            };

            $scope.select = function () {
              $scope.selected = this.member;
              if ($location.url() !== $scope.selectUrl && this.member.mutual) {
                $location.url($scope.selectUrl);
              } else if ($location.url() === '/testing/message' && !this.member.mutual) {
                $rootScope.back();
              }
            };

            initialize();
            
        }]);

angular.module('dancecardEditorDirective', [])
  .directive('dancecardEditor', function() {
    return {
      restrict: 'E',
      templateUrl: '../../partials/new/dancecard_editor.html',
      scope: {
        members: '=',
        max: '=',
        placeholders: '='
      },
      controller: 'DancecardEditorController',
      controllerAs: 'ctrl1'
    };
  })
  .controller('DancecardEditorController', function($scope) {

    var MAX_MEMBERS = 5;
    this.member = {};
    
    this.save = function() {
      console.log(this);
      console.log($scope);

      if ($scope.members.length < $scope.max) {
        $scope.members.push(this.member);
        $scope.placeholders.pop();
        this.member = {};
      } else {
        this.member = {};
        this.member.username = 'Dancecard is Full';
      }
    };
    
  });
