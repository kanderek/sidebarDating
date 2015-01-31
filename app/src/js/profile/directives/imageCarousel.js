angular.module('ImageCarouselDirective', ['angular-carousel'])
    .directive('imageCarousel', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/imageCarousel.html',
            scope: {
              images: '=',
            },
            link: link,
            controller: 'ImageCarouselController',
            controllerAs: 'icc'
        };
    }])
    .controller('ImageCarouselController', ['$scope', function($scope) {

      var _this = this;

      this.images = [];
      
      // function toArray(string) {
      //   var re = /\[(.*)\]/;
      //   var cleanedString;
      //   var result;

      //   // cleanedString = string.replace("/\[*\]*/g", "");
      //   cleanedString = string.match(re)[1];
      //   result = cleanedString.split(',');

      //   return result;
      // }

      // function initialize() {
      //   var images = toArray($scope.images);

      //   for (var i=0; i < images.length; i++) {
      //     _this.images.push({url: images[i]});
      //   }
      // }

      // initialize();
    }]);


