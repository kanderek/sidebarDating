// var SERVER = "http://sidebar-dating.herokuapp.com";
var SERVER = "http://localhost:3000";
var url_info = {};

/***************************************************************************
/
/ Communication between background.js
/
/***************************************************************************/

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("Message received in content script");
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // console.log("in content.js:  message received from extension ");
  // console.log("message: ");
  // console.log(message);
  // console.log("sender: ");
  // console.log(sender);
  //console.log("sendResponse: " + sendResponse);
  switch(message.type) {
    case "open-sidebar":
      if($('#injected-content').length === 0){
        console.log('opening sidebar');
        console.log(message.data);
        url_info = message.data;
        // $.get(chrome.extension.getURL('/content.html'), function(data) {
          $.get(chrome.extension.getURL('/iframe-experiment.html'), function(data) {
              $(data).appendTo('body');
        });
      }
      break;
    case "close-sidebar":
      console.log('closing sidebar');
      setTimeout(function(){
          $('#injected-content').remove();
          console.log('sidebar closed');
      }, 500);
      break;
  }
});

