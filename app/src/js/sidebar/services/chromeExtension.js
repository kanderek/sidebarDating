appServices.factory('ChromeExtension', function () {
  function requestInfoFromBackground(message){
      chrome.runtime.sendMessage({type: 'request', command: message}, function(response) {
        console.log('response from background script...');
        console.log(response);
      });
  }

  return {
    requestInfoFromBackground: requestInfoFromBackground,
  };
});