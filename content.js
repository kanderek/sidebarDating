
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
