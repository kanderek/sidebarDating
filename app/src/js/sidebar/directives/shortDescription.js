angular.module('ShortDescriptionDirective', [])
    .directive('shortDescription', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/shortDescription.html',
            // transclude: true,
            scope: {
              username: '@',
              shortBlurb: '@'
            },
            link: link,
            controller: 'ShortDescriptionController',
            controllerAs: 'sdc'
        };
    }])
    .controller('ShortDescriptionController', ['$scope', function($scope) {

      
    }]);


