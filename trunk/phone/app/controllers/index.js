var args = arguments[0] || {};

var isDebug = 'true';

var ct = require('common_ct');
ct.enableDebug();
var dbphone = require('common_db_phone');
// dbphone.enableDebug();
var myphones = Alloy.Collections.myphones;
var mymatches = Alloy.Collections.mymatches;

var longitude, latitude;

(function(activity) {
	Ti.API.info('into index gcm activity!');

	var intent = activity.intent;

	var gcm = {};
	gcm.data = {};
	// HERE we catch the intent extras of our notifications
	if (intent.hasExtra('ntfId')) {
		// and then we'll use 'data' property to pass info to the app (see pendingData lines of the 1st snippet)
		gcm.data = {
			ntfId : intent.getIntExtra('ntfId', 0)
		};
	}

	Ti.API.info('index gcm activity, gcm.data.ntfId = ' + gcm.data.ntfId);
	Ti.API.info('index gcm activity, gcm.data.data = ' + gcm.data.data);
	Ti.API.info('index gcm activity, gcm.isLauncherActivity = ' + gcm.isLauncherActivity);
	Ti.API.info('index gcm activity, gcm.mainActivityClassName = ' + gcm.mainActivityClassName);

	Ti.API.info('index gcm activity end');
})(Ti.Android.currentActivity);

function doRegister(e) {
	isDebug && Ti.API.info('in index, doRegister');
	ct.pregMerge({
		data : {
			"appVersion" : Alloy.Globals.appVersion,
			"deviceID" : Alloy.Globals.deviceID,
			"registerID" : Alloy.Globals.registerID,
			"senderID" : Alloy.Globals.senderID
		},
		success : function(m) {
			isDebug && Ti.API.info('in index, in doRegister, success, message = ' + JSON.stringify(m));
			dbphone.setOnlyItem(myphones, m);
			GUISetup();
		},
		fail : function(m) {
			Ti.API.error('in index, in doRegister, fail, message = ' + JSON.stringify(m));
			GUISetup();
		}
	});
}

function doMatch(e) {
	isDebug && Ti.API.info('in index, doMatch');
	var matchController = Alloy.createController('match', {
		isDebug : true
	});
	matchController && matchController.getView() && matchController.getView().open();
}

function doGPS_Fetch(e) {
	isDebug && Ti.API.info('in index, doGPS_Fetch');
	ct.pcpnMerge({
		data : {
			type : "sendGPS",
			message : 'request for GPS', //myphones.at(0).get('encodedKey')
			phoneid : myphones.at(0).get('encodedKey')
		},
		success : function(e) {
			isDebug && Ti.API.info('in index, in doGPS_Fetch, pcpnMerge, success, message = ' + JSON.stringify(e));
			var messageid = e.messageID;
			isDebug && Ti.API.info('in index, in doGPS_Fetch, pcpnMerge, success, messageid = ' + messageid);

			ct.pcpnSend({
				data : {
					phoneid : myphones.at(0).get('encodedKey'),
					messageid : messageid
				},
				success : function(ev) {
					isDebug && Ti.API.info('in index, in doGPS_Fetch, pcpnSend, success, message = ' + JSON.stringify(ev));
				},
				fail : function(ev) {
					Ti.API.error('in index, in doGPS_Fetch, pcpnSend, fail, message = ' + JSON.stringify(ev));
				}
			});
		},
		fail : function(e) {
			Ti.API.error('in index, in doGPS_Fetch, pcpnMerge, fail, message = ' + JSON.stringify(m));
		}
	});
}

function doMap(e) {
	isDebug && Ti.API.info('in index, doMap');
	$.MapB.visible = false;
	isDebug && Ti.API.info('in index, longitude = ' + longitude);
	isDebug && Ti.API.info('in index, latitude = ' + latitude);
	var intent = Ti.Android.createIntent({
		action : Ti.Android.ACTION_VIEW,
		data : 'geo:' + longitude + ',' + latitude
	});
	Ti.Android.currentActivity.startActivity(intent);
}

function GUISetup() {
	$.RegisterB.enabled = true;
	$.MatchB.enabled = false;
	$.GPS_FetchB.enabled = false;
	$.MessageTA.value = '';
	myphones.fetch();
	if (myphones.length !== 0) {
		$.RegisterB.enabled = false;
		var myphone = myphones.at(0);
		$.MessageTA.value = 'register success\nphoneid : ' + myphone.get('encodedKey');
		$.MatchB.enabled = true;

		mymatches.fetch();
		if (mymatches.length !== 0) {
			$.MessageTA.value += '\nmatch with ' + mymatches.length + ' devices';
			$.GPS_FetchB.enabled = true;
		}
	}

}

function GUIReady() {
	$.RegisterB.enabled = true;
	$.GPSInfoTA.visible = false;
	var gcm = require('net.iamyellow.gcmjs');

	var pendingData = gcm.data;
	if (pendingData && pendingData !== null) {
		// if we're here is because user has clicked on the notification
		// and we set extras for the intent
		// and the app WAS NOT running
		// (don't worry, we'll see more of this later)
		Ti.API.info('******* data (started) ' + JSON.stringify(pendingData));
	}

	gcm.registerForPushNotifications({
		success : function(ev) {
			// on successful registration
			Ti.API.info('******* success, ' + ev.deviceToken);
			Alloy.Globals.registerID = ev.deviceToken;
			doRegister();
		},
		error : function(ev) {
			// when an error occurs
			Ti.API.info('******* error, ' + ev.error);
			GUISetup();
		},
		callback : function(ev) {
			// when a gcm notification is received WHEN the app IS IN FOREGROUND
			Ti.API.info('******* callback, ' + JSON.stringify(ev));
			$.GPSInfoTA.visible = true;
			$.GPSInfoTA.value = 'get message : ' + JSON.stringify(ev);
			var message = ev.message;
			var myArr = message.split(',');
			if (myArr.length === 2) {
				longitude = myArr[0];
				latitude = myArr[1];
			}
			$.MapB.visible = true;

			alert('get message : ' + JSON.stringify(ev));
		},
		unregister : function(ev) {
			// on unregister
			Ti.API.info('******* unregister, ' + ev.deviceToken);
		},
		data : function(data) {
			// if we're here is because user has clicked on the notification
			// and we set extras in the intent
			// and the app WAS RUNNING (=> RESUMED)
			// (again don't worry, we'll see more of this later)
			Ti.API.info('******* data (resumed) ' + JSON.stringify(data));
		}
	});
}

// in order to unregister:
// require('net.iamyellow.gcmjs').unregister();
$.index.addEventListener('open', GUIReady);
$.index.addEventListener('focus', GUISetup);
isDebug && Ti.API.info('init done');

$.index.open();
