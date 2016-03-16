var sendInfoForSearch = {
	token: "発行したs自分のトークン",
	query: "from:bot in:bot_test has::no_entry_sign:"
};

var sendInfoForRemove = {
	token: "発行した自分（というかbotの投稿の削除権限を持ってる人）のトークン",
	channel: "C0SDUEPPU"
};

var searchAPI = "https://slack.com/api/search.messages";
var deleteAPI = "https://slack.com/api/chat.delete";


var EncodeHTMLForm = function(data) {
    var params = [];

    for( var name in data )
    {
        var value = data[ name ];
        var param = encodeURIComponent( name ) + '=' + encodeURIComponent( value );

        params.push( param );
    }

    return params.join( '&' ).replace( /%20/g, '+' );
}

var getJson = function(url, sendInfo, afterFunc) {
    var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
        if (r.readyState !== 4) return;
        var json = JSON.parse(r.responseText);
        afterFunc(r.status, json);
    };
    r.open("POST", url, true);
	r.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    r.send(EncodeHTMLForm(sendInfo));
};

var runSearch = function() {
    getJson(searchAPI, sendInfoForSearch, function(status, json) {
        if (status === 200) {
            if (json.ok) {
				var matches = json.messages.matches;
				var timeStamps = [];
				for (var i=0, len=matches.length; i<len; i++) {
					timeStamps[i] = matches[i].ts;
				}
				runRemove(timeStamps);
			} else {
				console.log("POST request has something wrong: " + json.error);
			}
        } else {
            console.log("HTTP status is NOT OK: " + status);
        }
    });
};

var runRemove = function(timeStanps) {
	for (var i=0, len=timeStanps.length; i<len; i++) {
		sendInfoForRemove.ts = timeStanps[i];
		getJson(deleteAPI, sendInfoForRemove, function(status, json) {
        	if (status === 200) {
				if (!json.ok) console.log("POST request has something wrong: " + json.error);
			} else {
				console.log("HTTP status is NOT OK: " + status);
        	}
		});
	}
};
var main = function() {
	runSearch();
}

setTimeout(main, 10);