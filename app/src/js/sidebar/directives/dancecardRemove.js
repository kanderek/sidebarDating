angular.module('DancecardRemoveDirective', ['appServices', 'ngDragDrop'])
    .directive('dancecardRemove', [function () {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/dancecardRemove.html',
            scope: {
              removeUrl: '@'
            },
            link: link,
            controller: 'dancecardRemoveController',
            controllerAs: 'drc'
        };
    }])
    .controller('dancecardRemoveController',
      [
        '$rootScope',
        '$scope',
        '$location',
        'DancecardService',

        function ($rootScope, $scope, $location, DancecardService) {

            var _this = this;

            function show() {
                $('#dancecard-remove-area').addClass('showRemoveArea');
            }

            function hide() {
                $('#dancecard-remove-area').removeClass('showRemoveArea drag-over-accept');
            }

            $rootScope.$on('ANGULAR_DRAG_START', function (event, channel) {
                console.log('drag started on channel... ' + channel);
                if (channel === 'remove-member') {
                  show();
                }
            });

            $rootScope.$on('ANGULAR_DRAG_END', function (event, channel) {
                console.log('drag ended for channel... ' + channel);
                if (channel === 'remove-member') {
                  hide();
                }
            });

            $scope.removeFromDancecard = function (event, data) {
                console.log('removing from dancecard...');
                console.log(event);
                console.log(data);

                DancecardService.stageForRemoval({
                  username: data.username,
                  userid: data.userid
                });

                hide();
                $location.url($scope.removeUrl);
            };
            
        }]);


