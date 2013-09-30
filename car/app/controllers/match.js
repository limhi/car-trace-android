var args = arguments[0] || {};

var isDebug = args.isDebug || false;
var ct = require('common_ct');
ct.enableDebug();
var mycars = Alloy.Collections.mycars;

function doMatch(e) {
	isDebug && Ti.API.info('in match, doMatch');
	if (mycars.length !== 1) {
		alert("register first!");
		return;
	}
	var mycar = mycars.at(0);
	ct.cprandomMerge({
		data : {
			carid : mycar.get('encodedKey')
		},
		success : function(m) {
			isDebug && Ti.API.info('in match, in doMatch, success, message = ' + JSON.stringify(m));
			$.MatchL.text = String.format("randomID=%s, deadTime=%s", m.randomID, m.deadTime);
		},
		fail : function(m) {
			Ti.API.error('in match, in doMatch, fail, message = ' + JSON.stringify(m));
		}
	});
}

function myback() {
	$.match.close();
}

$.header.on('rightFunction', function(e) {
	isDebug && Ti.API.info('in match, rightFunction');
});

$.header.on('back', myback);

$.match.addEventListener('androidback', function() {
	myback();
});
