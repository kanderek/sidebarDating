window.onload = function() {

	console.log("window.onload: still not sure what it does");
	document.getElementById("color").onclick = function() {
		console.log("color message sent off...");
		chrome.extension.sendMessage({
	        type: "color-divs"
	    });
	}

	document.getElementById("popup-in").onclick = function() {
		console.log("popup-in message sent off...");
		chrome.extension.sendMessage({
	        type: "popup-in"
	    });
	}

	document.getElementById("history").onclick = function() {
		console.log("history message sent off...");
		chrome.extension.sendMessage({
	        type: "history"
	    });
		//sendHistory();
	}

	document.getElementById("open-sidebar").onclick = function() {
		console.log("sidebar message sent off...");
		chrome.extension.sendMessage({
	        type: "open-sidebar"
	    });
	}

}

// fetch profiles from server
function sendHistory() {
  console.log("I'm in sendHistory");
  $.ajax({
	  type: "POST",
	  url: "http://localhost:3000/processHistory",
	  data: JSON.stringify({'url': "wwww.google.com"}),
	  contentType: 'application/json',
	  crossDomain: true,
	  success: function(res){
	  	console.log(res);
	  },
	  dataType: "text/plain"
	});
  // req = new XMLHttpRequest();
  // req.open('POST', 'http://localhost:8000/processHistory/');
  // req.setRequestHeader("Content-type", "application/json");
  // req.onload = alert("history posted");
  // req.send("derek j kan");//JSON.stringify({url: "someUrl", visits: 2}));
  // console.log(req);
}