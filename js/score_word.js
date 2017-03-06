
// display notification box on top right corner
function show_results(data, counter) {

	// source: https://notifyjs.com/
	$.notify.addStyle('result', {
  		html:
  			// using iframe to prevent css spilling from page
  			"<iframe id='notification_iframe" + counter + "' style='z-index: 99999999999'></iframe>"
	});

	$.notify({
	  		result_title: 'Word Scorer - Nitrio Edition',
		  	result_data: 'Word: '+ data.word +'<br/> Score: ' + data.score
		}, {
		  	style: 'result',
		  	autoHideDelay: 5000,
		  	position: "top right"
		  	// autoHide: false
		});

	var result_data = 'Sorry, this word is not valid :(';
	if (data.valid) {
		result_data = 'Word: '+ data.word +'<br/> Score: ' + data.score;
	}
	else if (data.statusText == 'error') {
		var result_data = 'Please make sure the scrabble_api_server is running!';
	}

	var html_to_inject =  	"<div style='color: white; text-align: center; font-family: \"Arial\", Helvetica, sans-serif;'>" +
							    "<div>" +
							    	"<div class='result_title' data-notify-html='result_title'>Word Scorer - Nitrio Edition</div>" +
							    	"<hr>" +
							    	"<div class='result_data' data-notify-html='result_data'>" + result_data + "</div>" +
							    "</div>" +
							"</div>";


	// injecting data results into iframe
	var iframe = document.getElementById("notification_iframe" + counter);
	iframe = iframe.contentWindow || ( iframe.contentDocument.document || iframe.contentDocument);

	iframe.document.open();
	iframe.document.write(html_to_inject);
	iframe.document.close();


}

// counter for unique iframe id
var counter = 0
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	// listener to get api call results sent from background script
	counter++;
	show_results(msg, counter);

});



