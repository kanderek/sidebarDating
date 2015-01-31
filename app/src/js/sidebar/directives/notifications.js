angular.module('NotificationsDirective', ['NotificationsModule'])
    .directive('notificationCenter', [function () {

        function link(scope, element, attrs) {

        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/notifications.html',
            // transclude: true,
            scope: {
            },
            link: link,
            controller: 'notificationsController',
            controllerAs: 'nc'
        };
    }])
    .controller('notificationsController', ['$scope', 'NotificationService', function ($scope, NotificationService) {

      var _this = this;

      this.selfid = 23;
      this.MAX_PROFILES = 7;
      this.notifications = [];

      function initialize() {
        NotificationService.getNotifications(_this.selfid)
          .then(function (notifications) {
            _this.notifications = notifications;
          });
      }

      $scope.markRead = function () {
        if (this.notification.status && this.notification.status === 'unread') {
          this.notification.status = 'read';
        }
      };

      $scope.isRead = function () {

        if (this.notification.status) {
          return this.notification.status === 'read';
        }
        return false;
      };

      $scope.followNotificationSender = function () {

      };

      initialize();

    }]);


