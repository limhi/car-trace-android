var args = arguments[0] || {};

var isDebug = args.isDebug || false;
var ct = require('common_ct');
ct.enableDebug();
var dbmatch = require('common_db_match');
dbmatch.enableDebug();
var myphones = Alloy.Collections.myphones;
var mymatches = Alloy.Collections.mymatches;

function doMatch(e) {
	isDebug && Ti.API.info('in match, doMatch');
	if (myphones.length !== 1) {
		alert("register first!");
		return;
	}

	var randomid = $.RandomidTF.value;
	if (randomid.length === 0) {
		alert("please enter random id first!");
		return;
	}

	var myphone = myphones.at(0);
	ct.cprandomMatch({
		data : {
			phoneid : myphone.get('encodedKey'),
			randomid : randomid
		},
		success : function(m) {
			isDebug && Ti.API.info('in match, in doMatch, success, message = ' + JSON.stringify(m));
			var modelArray = mymatches.where({
				phoneID : m.phoneID,
				carID : m.carID
			});
			isDebug && Ti.API.info('in match, in doMatch, success, modelArray.length = ' + modelArray.length);
			//如果還沒連結過
			if (_.isArray(modelArray) && modelArray.length === 0) {
				dbmatch.addItem(mymatches, {
					encodedKey : m.encodedKey,
					carID : m.carID,
					phoneID : m.phoneID,
					addTime : m.addTime,
					modTime : m.modTime
				});
				updateUI();
			}

		},
		fail : function(m) {
			Ti.API.error('in match, in doMatch, fail, message = ' + JSON.stringify(m));
		}
	});
}

function transformData(model) {
	var attrs = model.toJSON();
	// attrs.imageUrl = '/' + attrs.direction + '.png';
	// attrs.upperCaseName = attrs.name.toUpperCase();
	return attrs;
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
