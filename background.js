
var tabStatus = [/*{tabID: 0, status: false}*/];
var previousTabId;

var getTabClickCount = function(tabID){
  for(var i=0; i < clickCount.length; i++){
    if(clickCount[i].tabID == tabID){
      return {index: i, clickCount: clickCount[i].clickCount};
    }
  }
  return -1;
}

var isInClickCount = function(tabID){
  for(var i=0; i<clickCount.length; i++){
    if(clickCount[i].tabID == tabID){
     return true;
    }
  }
  return false;
}

var addTabToClickCount = function(tabID){
  clickCount.push({tabID: tabID, clickCount: 0});
}

var removeTabFromClickCount = function(tabID){

}

var resetTabClickCount = function(tabID){
    var countObj = getTabClickCount(tabID);
    if(countObj == -1){
    }
    else{
      clickCount[countObj.index].clickCount = 0;
    }
}

var incrementClickCountForTab = function(tabID){
  var countObj = getTabClickCount(tabID);
    if(countObj == -1){
      addTabToClickCount(tabID);
      clickCount[clickCount.length-1].clickCount++;
    }
    else{
      clickCount[countObj.index].clickCount++;
    }
}

var isBrowserActionActive = function(tabID){
    var countObj = getTabClickCount(tabID);
    
    if(countObj == -1){
      return false;
    }
    else{
      count = clickCount[countObj.index].clickCount;
    }

    if(count%2){
      return true;
    }
    else
    {
      return false;
    }
}

var setBrowserActionStateForTab = function(tabID){    
    
    if(isBrowserActionActive(tabID)){
      chrome.browserAction.setIcon({path: "./icons/19x19_heart.png"});
      openSidebar();
    }
    else
    {
      chrome.browserAction.setIcon({path: "./icons/19x19_heart_idle.png"});
      closeSidebar(tabID);
    }
}

chrome.browserAction.onClicked.addListener(function (tab) {
  console.log('browserAction clicked');
  incrementClickCountForTab(tab.id);
  setBrowserActionStateForTab(tab.id);    
});

chrome.tabs.onCreated.addListener(function (tab){
	console.log("tab created:");
	console.log(tab);
  addTabToClickCount(tab.id);

});

chrome.tabs.onActivated.addListener(function (activeInfo){
    if(previousTabId){
      //cleanup(remove) injected content.html from page being left
      if(isBrowserActionActive(previousTabId)){
        closeSidebar(previousTabId);
      }
    }

    previousTabId = activeInfo.tabId;
    console.log('tab activated');
    if(!isInClickCount(activeInfo.tabId)){
      addTabToClickCount(activeInfo.tabId);
    }
    setBrowserActionStateForTab(activeInfo.tabId);

});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
	


	if(changeInfo.status == "complete"){
    console.log("tab " + tabId + " updated: complete");
    resetTabClickCount(tabId);
    setBrowserActionStateForTab(tabId);
		//colorDivs();
    //  var opt = {
    //     type: "basic",
    //     title: "Primary Title",
    //     message: "Primary message to display",
    //     iconUrl: chrome.extension.getURL("icons/48x48_heart.png")
    //   }

    // chrome.notifications.getPermissionLevel(function(level){
    //   console.log(level);
    // });

    // chrome.notifications.create('', opt, function (id){
    //   console.log("notification create with id: " + id);
    // });

	}
  else if(changeInfo.url){
    console.log(changeInfo.url);
  }
  else if(changeInfo.status == "loading"){
    console.log("tab " + tabId + " updated: loading");
  }
  else {
    console.log("other tab update event");
    console.log(tabId);
    console.log(tab);
  }
});

chrome.history.onVisited.addListener(function (result){
	console.log("from history api call");
	//console.log(result);
});


// listening for an event / one-time requests
// coming from the popup
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("message received from popup at background.js");
	// console.log(request);
	// console.log(sender);
	// console.log(sendResponse);
    switch(request.type) {
        case "color-divs":
            //colorDivs();
            break;
        case "popup-in":
        	popupIn();
            break;
        case "history":
        	logHistory();
        	//sendHistory();
            break;
        case "open-sidebar":
          openSidebar();
          break;
    }
    return true;
});


var openSidebar = function(){
  console.log('in openSidebar');
    chrome.tabs.getSelected(null, function (tab){
      console.log(tab.id);
      chrome.tabs.sendMessage(tab.id, {type: "open-sidebar", data: "data"});
      // setting a badge
    //chrome.browserAction.setBadgeText({text: "red!"});
  });
}

var closeSidebar = function(tabID){
    //hrome.tabs.getSelected(null, function (tab){
      chrome.tabs.sendMessage(tabID, {type: "close-sidebar", data: "data"});
      // setting a badge
    //chrome.browserAction.setBadgeText({text: "red!"});
  //});
}

// listening for an event / long-lived connections
// coming from devtools
// chrome.extension.onConnect.addListener(function (port) {
//     port.onMessage.addListener(function (message) {
//        	switch(port.name) {
// 			case "color-divs-port":
// 				colorDivs();
// 			break;
// 		}
//     });
// });

var popupIn = function() {
	chrome.tabs.create({url: chrome.extension.getURL("./browserAction/popup.html")})
}

// send a message to the content script
var colorDivs = function() {
	chrome.tabs.getSelected(null, function(tab){
	    chrome.tabs.sendMessage(tab.id, {type: "colors-div", color: "#F00"});
	    // setting a badge
		chrome.browserAction.setBadgeText({text: "red!"});
	});
}

var logHistory = function() {

	var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  	var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

	 chrome.history.search({
      	'text': '',              // Return every history item....
      	'startTime': oneWeekAgo  // that was accessed less than one week ago.
    	}, 
    	function(historyItems) {
    		//console.log(historyItems);
    		sendHistory(historyItems);
    	});
}

// fetch profiles from server
function sendHistory(historyItems) {
  console.log("I'm in sendHistory");
  $.ajax({
    type: "POST",
    url: "http://localhost:8000/processHistory",
    data: JSON.stringify(historyItems),
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

// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Event listner for clicks on links in a browser action popup.
// Open the link in a new tab of the current window.
function onAnchorClick(event) {
  chrome.tabs.create({
    selected: true,
    url: event.srcElement.href
  });
  return false;
}

// fetch profiles from server
function getProfiles() {
  req = new XMLHttpRequest();
  req.open('GET', 'http://localhost:8000/');
  req.onload = processProfiles;
  req.send();
  //console.log(req);
}

// Given an array of URLs, build a DOM list of those URLs in the
// browser action popup.
function buildPopupDom(divName, data) {
  var popupDiv = document.getElementById(divName);

  var ul = document.createElement('ul');
  popupDiv.appendChild(ul);

  for (var i = 0, ie = data.length; i < ie; ++i) {
    var a = document.createElement('a');
    a.href = data[i];
    a.appendChild(document.createTextNode(data[i]));
    a.addEventListener('click', onAnchorClick);

    var li = document.createElement('li');
    li.appendChild(a);

    ul.appendChild(li);
  }
}

// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
function buildTypedUrlList(divName) {
  // To look for history items visited in the last week,
  // subtract a week of microseconds from the current time.
  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

  // Track the number of callbacks from chrome.history.getVisits()
  // that we expect to get.  When it reaches zero, we have all results.
  var numRequestsOutstanding = 0;

  chrome.history.search({
      'text': '',              // Return every history item....
      'startTime': oneWeekAgo  // that was accessed less than one week ago.
    },
    function(historyItems) {
      // For each history item, get details on all visits.
      for (var i = 0; i < historyItems.length; ++i) {
        var url = historyItems[i].url;
        var processVisitsWithUrl = function(url) {
          // We need the url of the visited item to process the visit.
          // Use a closure to bind the  url into the callback's args.
          return function(visitItems) {
            processVisits(url, visitItems);
          };
        };
        chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
        numRequestsOutstanding++;
      }
      if (!numRequestsOutstanding) {
        onAllVisitsProcessed();
      }
    });


  // Maps URLs to a count of the number of times the user typed that URL into
  // the omnibox.
  var urlToCount = {};

  // Callback for chrome.history.getVisits().  Counts the number of
  // times a user visited a URL by typing the address.
  var processVisits = function(url, visitItems) {
    for (var i = 0, ie = visitItems.length; i < ie; ++i) {
      // Ignore items unless the user typed the URL.
      if (visitItems[i].transition != 'typed') {
        continue;
      }

      if (!urlToCount[url]) {
        urlToCount[url] = 0;
      }

      urlToCount[url]++;
    }

    // If this is the final outstanding call to processVisits(),
    // then we have the final results.  Use them to build the list
    // of URLs to show in the popup.
    if (!--numRequestsOutstanding) {
      onAllVisitsProcessed();
    }
  };

  // This function is called when we have the final list of URls to display.
  var onAllVisitsProcessed = function() {
    // Get the top scorring urls.
    urlArray = [];
    for (var url in urlToCount) {
      urlArray.push(url);
    }

    // Sort the URLs by the number of times the user typed them.
    urlArray.sort(function(a, b) {
      return urlToCount[b] - urlToCount[a];
    });

    buildPopupDom(divName, urlArray.slice(0, 10));
  };
}
