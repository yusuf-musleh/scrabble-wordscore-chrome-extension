

function shift_iframes_down() {
	$("iframe[id*='notification_iframe']").animate({'top': "+=110px"}, { duration: 500, queue: false });
}


// display notification box on top right corner
function show_results(data, counter) {

	var result_data = 'Sorry, this word is not valid :(';
	if (data.valid) {
		result_data = 'Word: '+ data.word +'<br/> Score: ' + data.score;
	}
	else if (data.statusText == 'error') {
		var result_data = 'Please make sure the scrabble_api_server is running!';
	}

	shift_iframes_down();

	var html_to_inject = "<div style='background-color: #1b98dd; color: white; text-align: center; font-family: \"Arial\", Helvetica, sans-serif;'><div>Word Scorer - Nitrio Edition</div><hr><div>" + result_data + "</div></div>";

	var iframe = document.createElement("iframe");
	iframe.setAttribute("id", "notification_iframe" + counter);
	iframe.setAttribute("style", "border:none; width:250px; height:100px; position: fixed; top: 0; right:0; z-index: 99999999999; background-color: #1b98dd");
	iframe.setAttribute("frameborder", "0");

	document.body.appendChild(iframe);

	var iframe_div = document.getElementById("notification_iframe" + counter);
	iframe = iframe.contentWindow || ( iframe.contentDocument.document || iframe.contentDocument);
	iframe.document.open();
	iframe.document.write(html_to_inject);
	iframe.document.close();

	$("#notification_iframe" + counter).delay(5000).slideUp(300, function(){
		$("#notification_iframe" + counter).remove();
	});


}

// counter for unique iframe id
var counter = 0
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	// listener to get api call results sent from background script
	counter++;
	show_results(msg, counter);

});


