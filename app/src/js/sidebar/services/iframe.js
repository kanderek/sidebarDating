/*******************************************************************************************************
Iframe Service  */
angular.module('IframeModule', []).factory('Iframe', ['$rootScope',
  function($rootScope){

    var profileIframe = null;//window.parent.document.getElementById('profile');
    var profileWindow = window.parent; //null;//profileIframe ? profileIframe.contentWindow : null;
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
          sender: 'sidebar',
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

    // setInterval(function () {
    //   send('action', 'some data');
    // }, 3000);

    return {
      showProfile: showProfile,
      onMessage: onMessage
    };

}]);