angular.module('messagesDirective', ['MessageModule'])
    .directive('myMessages', ['$interval', function ($interval) {

        function link(scope, element, attrs) {
        }

        return {
            restrict: 'E',
            templateUrl: '../../partials/new/messages.html',
            scope: {
              selfId: '@',
              userId: '@'
            },
            link: link,
            controller: 'messagesController',
            controllerAs: 'mc'
        };
    }])
    .controller('messagesController', ['$scope', '$interval', 'MessageService', function($scope, $interval, MessageService) {

      var _this = this;
      var refresh = null;

      var REFRESH_TIME = 60000; //milliseconds

      this.conversation = [];

      function initialize() {
        MessageService.getMessageByuserid($scope.userId, $scope.selfId)
          .then(function (conversation) {
            _this.conversation = conversation;
            updateRelativeTimestamps(_this.conversation);
            scrollToBottom();
          });
      }

      $scope.test = function () {
        console.log($scope);
      };

      $scope.ifSentByUser = function (senderId) {
        return $scope.selfId !== senderId;
      };

      $scope.$watch(function ($scope) {
        return $scope.userId;
      }, function (userId) {
        _this.conversation = [];
        initialize();
      });

      $scope.$watch(function ($scope) {
        return $scope.conversation;
      }, function (conversation) {
        updateRelativeTimestamps(_this.conversation);
        scrollToBottom();
      });

      var scrollToBottom = function () {
        var element = $('#messages')[0];

        if (element.offsetHeight < element.scrollHeight) {
          var valueToScroll = element.scrollHeight;
          $("#messages").scrollTop(valueToScroll);
        }
      };

      function justNowify(time) {
        return moment(time).fromNow() === moment().fromNow() ? 'just now' : moment(time).fromNow();
      }

      function updateRelativeTimestamps(messages) {
        var sendtime1;
        var sendtime2;
        var totalMessages = messages.length;

        if (typeof messages !== 'undefined' && totalMessages > 1) {
          for(var i=1; i < totalMessages; i++){
             sendtime1 = justNowify(messages[i-1].sendTime);
             sendtime2 = justNowify(messages[i].sendTime);

             messages[i-1].relativeTimeStamp = sendtime1 === sendtime2 ? '' : sendtime1;
             messages[i].relativeTimeStamp = sendtime1 === sendtime2 ? sendtime1 : sendtime2;
          }
        }
      }

      function refreshTimestamps() {
        refresh = $interval(function () {
          updateRelativeTimestamps(_this.conversation);
          // console.log('refreshing timestamps....');

        }, REFRESH_TIME);
      }

      $scope.$on("$destroy", function() {
        if (refresh) {
            $interval.cancel(refresh);
        }
      });

      initialize();
      refreshTimestamps();
      
    }]);

angular.module('messageInputDirective', ['MessageModule'])
  .directive('messageInput', function() {

    var KEYS = {
      13: 'ENTER'
    };

    var link = function (scope, element, attr, controllers) {

      element.on('keypress', function (event) {
        if (KEYS[event.keyCode] === 'ENTER') {

          scope.$apply(function () {
            scope.mic.sendMessage();
          });

          event.preventDefault();
        }
      });
    };

    return {
      restrict: 'E',
      templateUrl: '../../partials/new/messageInput.html',
      scope: {
        messages: '=',
        selfId: '@',
        userId: '@'
      },
      controller: 'messageInputController',
      controllerAs: 'mic',
      link: link
    };
  })
  .controller('messageInputController', ['$scope', 'MessageService', function($scope, MessageService) {

    this.sendMessage = function () {
      // MessageService.sendMessage({
      //     senderid: 23,
      //     receiverid: 2,
      //     sendTime: moment().format(),
      //     message: this.newMessage
      //   });
      $scope.messages.push({
          senderid: $scope.selfId,
          receiverid: $scope.userId,
          sendTime: moment().format(),
          message: this.newMessage
        });
      
      this.newMessage = '';
    };

  }]);


      

