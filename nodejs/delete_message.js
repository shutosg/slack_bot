var request = require('request');

var searchOptions = {
	uri: "https://slack.com/api/search.messages",
	form: {
		token: "発行した自分のトークン",
		query: "from:bot in:bot_test has::no_entry_sign:"
	},
	json: true
}

var deleteOptions = {
	uri: "https://slack.com/api/chat.delete",
	form: {
		token: "発行した自分（というかbotの投稿の削除権限を持ってる人）のトークン",
		channel: "チャンネルID"
	},
	json: true
}

var runSearch = function() {
	request.post(searchOptions, function(error, response, body){
		if (!error) {
			if (response.statusCode == 200) {
				var matches = body.messages.matches;
				var timeStamps = [];
				for (var i=0, len=matches.length; i<len; i++) {
					timeStamps[i] = matches[i].ts;
				}
				runDelete(timeStamps);
			} else {
				console.log("http error: " + response.statusCode);
			}
		} else {
			console.log('some error: ' + error)
	}
});
};

var runDelete = function(timeStamps) {
	for (var i=0, len=timeStamps.length; i<len; i++) {
		deleteOptions.form.ts = timeStamps[i];
		request.post(deleteOptions, function(error, response, body){
			if (!error) {
				if (response.statusCode == 200) {
					if (!body.ok) console.log("could not delete: " + body.error);
				} else {
					console.log("http error: " + response.statusCode);
				}
			} else {
				console.log('some error: ' + error)
			}
		});
	}
}

var main = function() {
	runSearch();
}

setTimeout(main, 10);
