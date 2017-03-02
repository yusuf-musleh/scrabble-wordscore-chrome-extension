
// make call to api get get wordscore
function call_scrabble_wordscore_api(word) {

	  var scrabble_wordscore_url = "http://localhost:8000/wordscore/" + word;
	  $.getJSON( scrabble_wordscore_url, {
	      format: "json"
	  })
	  .done(function (data) {
	  	send_data_to_foreground(data);
	  })
	  .fail(function(data) {
		send_data_to_foreground(data);
	  });

};


function send_data_to_foreground(data){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
	    chrome.tabs.sendMessage(tabs[0].id, data, function(response) {});
	});
}


var scoreWord = function(selected_word, tab){
    var word = selected_word.selectionText.trim();
    call_scrabble_wordscore_api(word);
 };


// adding Score Word option in contextMenu (right clicking highlighted text)
// only appears in right click menu when text is highlighted
chrome.contextMenus.create({
 title: "Score Word",
 contexts:["selection"],
 onclick: scoreWord
});


// inject content script in all open tabs upon installing/upgrading extension
// source: http://stackoverflow.com/questions/10994324/chrome-extension-content-script-re-injection-after-upgrade-or-install
chrome.manifest = chrome.app.getDetails();

var injectIntoTab = function (tab) {
    // iterate through the content scripts
    var scripts = chrome.manifest.content_scripts[0].js;
    var s = scripts.length;
    for(var i = 0; i < s; i++) {
        chrome.tabs.executeScript(tab.id, {
            file: scripts[i]
        });
    }
}

// Get all windows and loop over all tabs to inject script to
chrome.windows.getAll({
    populate: true
}, function (windows) {
    var w = windows.length, currentWindow;
    for(var i = 0; i < w; i++) {
        currentWindow = windows[i];
        var t = currentWindow.tabs.length, currentTab;
        for(var j = 0; j < t; j++) {
            currentTab = currentWindow.tabs[j];
            // Skip chrome:// and file://
            if(currentTab.url.indexOf("chrome://") == -1 && currentTab.url.indexOf("file://") == -1) {
            	injectIntoTab(currentTab);
            }
        }
    }
});
