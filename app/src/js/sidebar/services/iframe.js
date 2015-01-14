/*******************************************************************************************************
Iframe Service  */
appServices.factory('Iframe', ['$rootScope',
  function($rootScope){

    var profileIframe = window.parent.document.getElementById('profile');
    var profileWindow = profileIframe ? profileIframe.contentWindow : null;
    var allowedFrames = '*';

    var actions = {};

    function receive() {
      console.log('receive called, event listener should be up');
      window.addEventListener('message', handleMessageReceipt, false);
    }

    function send(action, data) {
       console.log('sidebar iframe sent a message!');
       if (profileWindow) {
         profileWindow.postMessage({
          action: action,
          data: data
        }, allowedFrames);
      }
    }

    function handleMessageReceipt(event) {
        console.log('sidebar iframe reveived a message!');
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

    function showProfile(options) {
      send('showProfile', options);
    }

    receive();

    return {
      showProfile: showProfile,
      onMessage: onMessage
    };

}]);