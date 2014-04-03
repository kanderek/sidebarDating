window.onload = function() {

	document.getElementById("history").onclick = function() {
		console.log("history message sent off from popup...");
		chrome.extension.sendMessage({
	        type: "history"
	    });
		//sendHistory();
	}

	document.getElementById("open-sidebar").onclick = function() {
		console.log("sidebar message sent off from popup...");
		chrome.extension.sendMessage({
	        type: "open-sidebar"
	    });
	}
}

