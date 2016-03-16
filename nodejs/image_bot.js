var http = require('http');
var qs = require('querystring');
var Flickr = require("flickrapi");
var flickrOptions = {
 	api_key: "FlickrのAPI_KEY",
	secret: "Flickrのsecret"
 };

var responseJson = {};

var postSlack = function(data, res) {
	var query = data.text.match(/<@U0SDJBPNK> (.+)/)[1];
	if (query) {
		query = query.replace(/ /g, "+");
	}

	var photoUrl = "";
	var reply = " 画像が見つかりませんでした。";
	Flickr.tokenOnly(flickrOptions, function(error, flickr) {
		flickr.photos.search({text: query}, function(err, result){
			if (err) {throw new Error(err);}
			//console.log(result);
			if (result.photos.pages > 0){
				var N = parseInt(Math.random()*Math.min(result.photos.perpage, result.photos.total*0.3));
				var photo = result.photos.photo[N];
				//console.log(result);
				//console.log(photo);
				photoUrl = "http:\/\/farm" + photo.farm + "\.staticflickr\.com\/" + photo.server + "\/" + photo.id + "_" + photo.secret + "\.jpg";
				reply = " " + photoUrl;
			}
			responseJson = {
				'text': '@' + data.user_name + reply,
				'username': 'bot',
				'icon_url': 'https:\/\/slack.global.ssl.fastly.net\/12b5a\/plugins\/bot\/assets\/service_72.png',
				'link_names': 1
			};
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(responseJson));
		});
	});
}

var listener = function(req, res) {
	if (req.method != 'POST') {
		res.writeHead(403, {'Content-Type': 'text/html'});
		res.end('<head><title>403 Forbidden</title></head><body><h1>Forbidden</h1><p>You don\'t have permission to access this page.<p></body>');
		return;
	}
	var body = '';
	req.on('data', function(data){body += data;});
	req.on('end', function(){
		var postedData = qs.parse(body);
		//console.log(postedData);
		if (postedData.token == '本当に自分の生成したOutgoing Webhooksであるかの確認用トークン') {
			//responseJson = makeJson(postedData);
			postSlack(postedData, res);
		} else {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({'ok': 'false', 'error': 'token_is_invalid'}));
		}
	});
};
http.createServer(listener).listen(4649);
