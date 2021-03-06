
var tabStatus = {/* tabid: false*/};
var previousTab;
var isAnimating = false;

var initializeTabStatus = function(tabID){
  tabStatus[tabID] = false;
  // return tabStatus.push({tabID: tabID, status: false}) - 1;

}

var tabNotLogged = function(tabID){
  return typeof(tabStatus[tabID]) == 'undefined';
}

var removeTabStatus = function(tabID){
  // var index = getTabStatusIndex(tabID);
  // tabStatus.splice(index,1);
  delete tabStatus[tabID];
}

// var getTabStatusIndex = function(tabID){
//   for(var i=0; i<tabStatus.length; i++){
//     if(tabID == tabStatus[i].tabID){
//       return i;
//     }
//   }
//   return -1;
// }

var resetTabStatus = function(tabID){
  // var index = getTabStatusIndex(tabID);
  tabStatus[tabID] = false;
  // return index;
}

var toggleTabStatus = function(tab){
  if(!isAnimating){
    // var index = getTabStatusIndex(tab.id);
    // console.log(index);
    if(tabNotLogged(tab.id)){
      // index = initializeTabStatus(tab.id);
      initializeTabStatus(tab.id);
    }
        // var status = tabStatus[tab.id];
    if(tabStatus[tab.id]){
      tabStatus[tab.id] = false;
      // chrome.browserAction.setIcon({path: "./icons/19x19_heart_idle.png"});
    }
    else{
      tabStatus[tab.id] = true;
    }

    setBrowserActionIcon(tabStatus[tab.id]);
    callBrowserAction(tab, tabStatus[tab.id]);
  }
}

var setBrowserActionIcon = function(status){
  console.log(tabStatus);
  if(status){
    chrome.browserAction.setIcon({path: "./images/19x19blue.png"});
  }
  else{
    chrome.browserAction.setIcon({path: "./images/19x19grey.png"});
  }
}

var callBrowserAction = function(tab, status){
    waitForAnimation();
    if(status){
      openSidebar(tab);
    }
    else{
      closeSidebar(tab);
    }
}

var waitForAnimation = function(){
  isAnimating = true;
  setTimeout(function(){
    isAnimating = false;
  }, 500);
}

var isBrowserActionActive = function(tabID){
  // var index = getTabStatusIndex(tabID);
  // if(index == -1){
  //   return false;
  // }
  // else{
  //   return true;
  // }
  return tabStatus[tabID];
}


chrome.browserAction.onClicked.addListener(function (tab) {
  console.log('browserAction clicked');
  //injectAngular(tab.id);
  console.log(tab);
  toggleTabStatus(tab);
});


chrome.tabs.onCreated.addListener(function (tab){
	console.log("tab created: " + tab.id);
	//console.log(tab);
  // var index = initializeTabStatus(tab.id);
  initializeTabStatus(tab.id);
  // tabStatus[tab.id] = tabStatus[previousTab];
});


chrome.tabs.onActivated.addListener(function (activeInfo){
  console.log('tab activated: ' + activeInfo.tabId);
  // var index = getTabStatusIndex(activeInfo.tabId);
  if(tabNotLogged(activeInfo.tabId)){
    // index = initializeTabStatus(activeInfo.tabId);
     initializeTabStatus(activeInfo.tabId);
  }
  // previousTab should be set here but how??
  setBrowserActionIcon(tabStatus[activeInfo.tabId]);
});


chrome.tabs.onRemoved.addListener(function (tabID, removeInfo){
  console.log('tab removed: ' + tabID);
  removeTabStatus(tabID);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){

  console.log('tab updated: ' + tabId);
  console.log(changeInfo);

  // var index = getTabStatusIndex(tabId);
	if(changeInfo.status == "complete"){
    // console.log('index on updated complete: ' + index);
    if(tabNotLogged(tabId)){
      // index = initializeTabStatus(tabId);
      initializeTabStatus(tabId);
    }

    // copy previous tab's sidebar status to current tab, activate if true
    // tabStatus[index].status = tabStatus.length > 1 ? tabStatus[index-1].status : false;
    // tabStatus[tabId] = tabNotLogged(previousTab) ? tabStatus[previousTab] :  
    console.log('previous tab: ');
    console.log(previousTab);

    if (tabStatus[tabId]) {
      setBrowserActionIcon(tabStatus[tabId]);
      callBrowserAction(tab, tabStatus[tabId]);
    }


	}
  else if(changeInfo.status == "loading" && changeInfo.url){
    // resetTabStatus(tabId);
    // setBrowserActionIcon(tabStatus[index].status);

  }
  else if(changeInfo.status == "loading"){
    // setBrowserActionIcon(tabStatus[index].status);

  }
});

var openSidebar = function(tab){
  console.log('open Sidebar');
  chrome.tabs.sendMessage(tab.id, {type: "open-sidebar", data: {url: tab.url, page_title: tab.title}});
  // setting a badge
  //chrome.browserAction.setBadgeText({text: "red!"});
}

var closeSidebar = function(tab){
  chrome.tabs.sendMessage(tab.id, {type: "close-sidebar", data: {url: tab.url, page_title: tab.title}});
  console.log('closing Sidebar...activated from background');
    // setting a badge

  // setTimeout(function(){
  //     chrome.browserAction.setBadgeText({text: "99"});
  // },3000);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url :"from the extension");

    if (request.type == "close-sidebar"){
      closeSidebar(sender.tab);
      var index = resetTabStatus(sender.tab.id);
      setBrowserActionIcon(tabStatus[index].status);
      sendResponse({sidebar: "closed"});
    }

    if (request.type == "request"){
      sendResponse({what: "yeeesss!", history: 'some data here'});
    }

    if (request.type == "history"){
      console.log('history requested');
      console.log(request);
      chrome.history.search({text: '', startTime: request.time_ago, maxResults: request.limit}, function(historyRecord){
          console.log('response should be sent off ot content script...');
          sendResponse(historyRecord);
      });
      return true;
    }

});




var sampleNotification = function(){
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

chrome.history.onVisited.addListener(function (result){
	console.log("from history api call");
	//console.log(result);
});

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


/******************************************************************
//
// TAKEN FROM SAMPLE EXTENSION USING CHROME HISTORY API
//

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

*/
