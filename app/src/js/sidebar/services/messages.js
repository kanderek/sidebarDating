/*******************************************************************************************************
Message Service  */

angular.module('MessageModule', [])
  .factory('MessageService',
    [
      '$q',
      '$http',

      function ($q, $http) {

        var conversations = {};
        var chattingWith = null;

        function getStaticMessages() {
          var D = $q.defer();

          $http({
              method: 'GET',
              url: "staticData/messages.json"
          })
            .success(function(data, status, headers, config){
              D.resolve(data);
            });

          return D.promise;
        }

        function getStaticMessageByuserid(userid) {
          var D = $q.defer();

          $http({
            method: 'GET',
            url: "staticData/message_user" + userid + ".json"
          })
            .success(function(data, status, headers, config){
              D.resolve(data);
            });

          return D.promise;
        }

        function getMessageByuserid(userid1, userid2) {
          var D = $q.defer();

          var conversation = conversations[userid1];

          if (conversation) {
            D.resolve(conversation);
          } else {

            $http({
              method: 'GET',
              url: SERVER + "/message/" + userid1 + "/?userId=" + userid2
            })
              .success(function(data, status, headers, config){
                conversations[userid1] = data;
                D.resolve(data);
              })
              .error(function(data, status, headers, config){
                console.log('error getting messages from server ' + SERVER);
                D.reject();
              });
          }

          return D.promise;
        }

        function sendMessage(message) {
          var D = $q.defer();
          
          var conversation = conversations[message.receiverid];

          if(message.senderid !== message.receiverid){

            if (conversation) {
              conversations[message.receiverid].push(message);
            } else {
              conversations[message.receiverid] = [message];
            }

            $http({
              method: 'POST',
              url: SERVER + "/message/",
              data: message
            })
              .success(function(data, status, headers, config){
                D.resolve(data);
              })
              .error(function(data, status, headers, config){
                console.log('error posting message');
                D.reject();
              });
          }
          else{
            console.log('Cannot send message to yourself');
            D.reject();
          }

          return D.promise;
        }

      return {
        sendMessage: sendMessage,
        getMessageByuserid: getMessageByuserid,
        getStaticMessageByuserid: getStaticMessageByuserid,
        getStaticMessages: getStaticMessages
      };
    }]);