angular.module('myDancecardDirective', ['appServices', 'ngDragDrop'])
    .directive('myDancecard', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/dancecard.html',
            scope: {
              userid: '@',
              // members: '?=',
              selected: '=',
              selectUrl: '@'
            },
            link: link,
            controller: 'dancecardController',
            controllerAs: 'ctrl2'
        };
    }])
    .controller('dancecardController', ['$scope', '$location', 'DancecardService', function($scope, $location, DancecardService) {

      var placeholderImage = '';
      var _this = this;

      this.MAX_MEMBERS = 5;

      // DancecardService.getStaticDancecard()
      //   .then(function (members) {
      //     _this.members = members;
      //     _this.updatePlaceholders();
      //   });


      DancecardService.getDancecardById($scope.userid)
        .then(function (members) {
          _this.members = members.map(function(member) {
            member.image_url = SERVER + member.image_url;
            return member;
          });
          _this.updatePlaceholders();
        });

      this.updatePlaceholders = function () {
        this.placeholders = [];

        for (var i=this.members.length; i < this.MAX_MEMBERS; i++) {
          this.placeholders.push({image_url: ''});
        }
      };

      $scope.addToDancecard = function (event, data) {
        console.log('item dropped...');
        console.log(data);
        console.log(event);
      };

      $scope.isSelected = function () {
        return !!$scope.selected;
      };

      $scope.select = function () {
        $scope.selected = this.member;
        if ($location.url() !== $scope.selectUrl) {
          $location.url($scope.selectUrl);
        }
      };
      
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
