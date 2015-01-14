/*******************************************************************************************************
Iframe Service  */
appServices.factory('Iframe', ['$rootScope',
  function($rootScope){

    console.log('Iframe service');

    var sidebarWindow = window.parent.document.getElementById('sidebar').contentWindow;
    var allowedFrames = '*';

    var actions = {};

    function receive() {
      console.log('receive called, event listener should be up');
      window.addEventListener('message', handleMessageReceipt, false);
    }

    function send(action, data) {
       console.log('profile iframe sent a message!');
       sidebarWindow.postMessage({
        action: action,
        data: data
      }, allowedFrames);
    }

    function handleMessageReceipt(event) {
        console.log('profile iframe reveived a message!');
        console.log(event.data);

        var action = event.data.action;
        var data = event.data.data;

        try {
          if (action && actions[action]) {
            actions[action](data);
          }
        } catch (error) {
          console.log(error);
        }
    }

    function onMessage(action, callback) {
      actions[action] = callback;
    }

    function addToDancecard(userid) {
      send('addToDancecard', {userid: userid});
    }

    function removeFromDancecard(userid) {
      send('removeFromDancecard', {userid: userid});
    }

    function openMessages(userid) {
      send('openMessages', {userid: userid});
    }

    receive();

    return {
      addToDancecard: addToDancecard,
      removeFromDancecard: removeFromDancecard,
      openMessages: openMessages,
      onMessage: onMessage
    };

}]);