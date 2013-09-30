var args = arguments[0] || {};

var isDebug = 'true';

var ct = require('common_ct');
var dbcar = require('common_db_car');
// dbcar.enableDebug();
var mycars = Alloy.Collections.mycars;

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
	ct.cregMerge({
		data : {
			"appVersion" : Alloy.Globals.appVersion,
			"deviceID" : Alloy.Globals.deviceID,
			"registerID" : Alloy.Globals.registerID,
			"senderID" : Alloy.Globals.senderID
		},
		success : function(m) {
			isDebug && Ti.API.info('in index, in doRegister, success, message = ' + JSON.stringify(m));
			dbcar.setOnlyItem(mycars, m);
		},
		fail : function(m) {
			Ti.API.error('in index, in doRegister, fail, message = ' + JSON.stringify(m));
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

function GUIReady() {
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
		},
		callback : function(ev) {
			// when a gcm notification is received WHEN the app IS IN FOREGROUND
			Ti.API.info('******* callback, ' + JSON.stringify(ev));
			alert('hellow push notification!');
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
isDebug && Ti.API.info('init done');

$.index.open();
