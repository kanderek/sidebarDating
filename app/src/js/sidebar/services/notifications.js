/*******************************************************************************************************
Notification Service  */

angular.module('NotificationsModule', [])
  .factory('NotificationService',
    [
      '$q',
      '$http',
      '$interval',

    function ($q, $http, $interval) {

        function refreshTimestamps(){
           $interval(function(){
            for(var i=0; i< notificationService.notifications.length; i++){
              notificationService.notifications[i].relativeTimestamp = moment(notificationService.notifications[i].action_time).fromNow();
            }
            // console.log('refreshing timestamps for notifications....');
          }, 60000);
        }

    var notificationService = {};

        var notifications = [];
        var unreadCount = 0;

        function getUnreadCount() {

          unreadCount = 0;

          for (var i=0; i < notifications.length; i++) {
            if (notifications[i].status === "unread") {
              unreadCount += 1;
            }
          }

          return unreadCount;
        }


        function markRead(index) {
          if (notifications[index].status == 'unread') {
            unreadCount--;
            notifications[index].status = 'read';
            updateNotificationStatus({
                notification: {
                  status: notifications[index].status,
                  notificationid: notifications[index].notificationid
                }
            });
          }
        }

        function addNotification(notification) {
            console.log(notification);
            // notification.relativeTimestamp = moment(notification.action_time).fromNow();
            notification.smallimage = SERVER + '/' + notification.imgurl;
            notifications.unshift(notification);
            unreadCount++;
        }

        function getNotifications(userid) {

          var D = $q.defer();

          $http({
            method: 'GET',
            url: SERVER + "/notifications/" + userid
          })
            .success(function(data, status, headers, config){
     
                  for (var i=0; i < data.length; i++) {
                    // TODO: move this logic to the server side.
                    // data[i].relativeTimestamp = moment(data[i].action_time).fromNow();
                    data[i].smallimage = SERVER + '/' + data[i].smallimageurls[0];
                  }

                   notifications = data;
                   getUnreadCount();
                   console.log(data);
                   D.resolve(data);
            })
            .error(function(data, status, headers, config){
              console.log('error getting static json file');
              D.reject();
            });

          return D.promise;
        }

        function updateNotificationStatus(data) {
            $http({
              method: 'POST',
              url: SERVER + "/notifications/",
              data: data
            })
              .success(function(data, status, headers, config){
                D.resolve(data);
            })
            .error(function(data, status, headers, config){
              console.log('error posting message');
              D.reject();
            });
        }

    return {
      getNotifications: getNotifications
    };
  }]);