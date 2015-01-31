angular.module('SharedInterestDirective', [])
    .directive('sharedInterests', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/sharedInterest.html',
            scope: {
              userData: '=',
            },
            link: link,
            controller: 'SharedInterestController',
            controllerAs: 'sic'
        };
    }])
    .controller('SharedInterestController', ['$scope', function($scope) {

      var _this = this;

      this.interestData = [
        {
          url: 'http://www.nytimes.com/2015/01/23/science/rosetta-finds-out-much-about-a-comet-even-with-a-wayward-lander.html?ref=science&_r=0',
          image_url: 'http://graphics8.nytimes.com/images/2015/01/23/science/23comet/23comet-sfSpan.jpg',
          title: 'Rosetta Finds Out Much About a Comet, Even With a Wayward Lander',
          info: 'SCIENCE',
          attr: {

          }
        },
        {
          url: 'http://www.nytimes.com/2015/01/23/science/rosetta-finds-out-much-about-a-comet-even-with-a-wayward-lander.html?ref=science&_r=0',
          image_url: 'http://graphics8.nytimes.com/images/2015/01/23/science/23comet/23comet-sfSpan.jpg',
          title: 'Rosetta Finds Out Much About a Comet, Even With a Wayward Lander',
          info: 'SCIENCE',
          attr: {

          }
        },
        {
          url: 'http://www.nytimes.com/2015/01/23/science/rosetta-finds-out-much-about-a-comet-even-with-a-wayward-lander.html?ref=science&_r=0',
          image_url: 'http://graphics8.nytimes.com/images/2015/01/23/science/23comet/23comet-sfSpan.jpg',
          title: 'Rosetta Finds Out Much About a Comet, Even With a Wayward Lander',
          info: 'SCIENCE',
          attr: {

          }
        },
        {
          url: 'http://www.nytimes.com/2015/01/23/science/rosetta-finds-out-much-about-a-comet-even-with-a-wayward-lander.html?ref=science&_r=0',
          image_url: 'http://graphics8.nytimes.com/images/2015/01/23/science/23comet/23comet-sfSpan.jpg',
          title: 'Rosetta Finds Out Much About a Comet, Even With a Wayward Lander',
          info: 'SCIENCE',
          attr: {

          }
        },
        {
          url: 'http://www.nytimes.com/2015/01/23/science/rosetta-finds-out-much-about-a-comet-even-with-a-wayward-lander.html?ref=science&_r=0',
          image_url: 'http://graphics8.nytimes.com/images/2015/01/23/science/23comet/23comet-sfSpan.jpg',
          title: 'Rosetta Finds Out Much About a Comet, Even With a Wayward Lander',
          info: 'SCIENCE',
          attr: {

          }
        },

      ];
            
    }])
    .directive('interestTile', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/interestTile.html',
            scope: {
              interestData: '=',
            },
            link: link,
            controller: 'InterestTileController',
            controllerAs: 'itc'
        };
    }])
    .controller('InterestTileController', ['$scope', function ($scope) {

      var _this = this;
            
    }]);