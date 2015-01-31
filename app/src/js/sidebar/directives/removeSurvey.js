angular.module('RemoveSurveyDirective', ['appServices'])
    .directive('removeSurvey', ['$interval', function ($interval) {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/removeSurvey.html',
            // transclude: true,
            scope: {
            },
            link: link,
            controller: 'removeSurveyController',
            controllerAs: 'rsc'
        };
    }])
    .controller('removeSurveyController', ['$scope', 'DancecardService', function($scope, DancecardService) {

      var _this = this;

      
      
    }]);


