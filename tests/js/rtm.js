var sendInfo = {
	"token": "自分のトークン"
};

var APIUrl = "https://slack.com/api/rtm.start";


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

var getJson = function(url, afterFunc) {
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

var runAPI = function() {
    getJson(APIUrl, function(status, json) {
        if (status === 200) {
            if (json.ok) {
				//console.log(json.channels[0]);
				console.log(json.self.name);
			} else {
				console.log("POST request has something wrong: " + json.error);
			}
        } else {
            console.log("HTTP status is NOT OK: " + status);
        }
    });
};

var main = function() {
	runAPI();
}

setTimeout(main, 10);