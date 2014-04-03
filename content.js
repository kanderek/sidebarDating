


chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {

	console.log("content script");
	//sendHistory();

});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.log("in content.js:  message received from extension ");
	console.log("message: " + message);
	console.log("sender: " + sender);
	console.log("sendResponse: " + sendResponse);
	switch(message.type) {
		case "colors-div":
			var divs = document.querySelectorAll("div");
			if(divs.length === 0) {
				alert("There are no any divs in the page.");
			} else {
				for(var i=0; i<divs.length; i++) {
					console.log(divs[i]);
					divs[i].style.backgroundColor = message.color;
				}
			}
			break;
		case "open-sidebar":
			console.log('opening sidebar');
			$.get(chrome.extension.getURL('/content.html'), function(data) {
			    $(data).appendTo('body');
			});
			break;
		case "close-sidebar":
			console.log('closing sidebar');
			$('#injected-content').remove();
			break;
	}
});



// fetch profiles from server
function sendHistory() {
  console.log("I'm in sendHistory");
 //  $.ajax({
	//   type: "POST",
	//   url: "http://localhost:8000/processHistory",
	//   data: {url: "wwww.google.com"},
	//   success: function(res){
	//   	console.log(res);
	//   },
	//   dataType: "jsonp"
	// });
  req = new XMLHttpRequest();
  req.open('POST', 'http://localhost:8000/processHistory/');
  req.setRequestHeader("Content-type", "application/json");
  req.onload = alert("history posted");
  req.send(JSON.stringify({url: "someUrl", visits: 2}));
  console.log(req);
}