var args = arguments[0] || {};

var isDebug = true;

var ct = require('common_ct');
ct.enableDebug();
var dbcar = require('common_db_car');
// dbcar.enableDebug();
var mycars = Alloy.Collections.mycars;
var mymatches = Alloy.Collections.mymatches;

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
			GUISetup();
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

function GUISetup() {
	$.RegisterB.enabled = true;
	$.MatchB.enabled = false;
	$.MessageTA.value = '';
	mycars.fetch();
	if (mycars.length !== 0) {
		$.RegisterB.enabled = false;
		var mycar = mycars.at(0);
		$.MessageTA.value = 'register success\ncarid : ' + mycar.get('encodedKey');
		$.MatchB.enabled = true;

		mymatches.fetch();
		if (mymatches.length !== 0) {
			$.MessageTA.value += '\nmatch with ' + mymatches.length + ' devices';
		}
	}
}

function GUIReady() {
	$.RegisterB.enabled = true;
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
			//alert('hellow push notification!');
			isDebug && Ti.API.info('mycars.length = ' + mycars.length);
			if (mycars.length !== 0) {
				var mycar = mycars.at(0);
				// var mycar = mycat
				Ti.Geolocation.distanceFilter = 10;
				// set the granularity of the location event

				Ti.Geolocation.getCurrentPosition(function(e) {
					if (e.error) {
						Ti.API.error('in index, get gps, error = ' + e.error);
						// alert(e.error);
						return;
					}

					var longitude = e.coords.longitude;
					var latitude = e.coords.latitude;
					var altitude = e.coords.altitude;
					var heading = e.coords.heading;
					var accuracy = e.coords.accuracy;
					var speed = e.coords.speed;
					var timestamp = e.coords.timestamp;
					var altitudeAccuracy = e.coords.altitudeAccuracy;

					// we use the above data the way we need it
					isDebug && Ti.API.info(String.format("longitude=%s, latitude=%s", longitude, latitude));
					ct.cppnMerge({
						data : {
							title : "backGPS",
							message : String.format("%s,%s", longitude, latitude),
							rowdata : {
								"type" : "cartype",
								"data" : "cardata"
							},
							carid : mycar.get('encodedKey')
						},
						success : function(e) {
							isDebug && Ti.API.info('in index, cppnMerge, success, message = ' + JSON.stringify(e));
							var messageid = e.messageID;
							isDebug && Ti.API.info('in index, cppnMerge, success, messageid = ' + messageid);

							ct.cppnSend({
								data : {
									carid : mycar.get('encodedKey'),
									messageid : messageid
								},
								success : function(ev) {
									isDebug && Ti.API.info('in index, cppnSend, success, message = ' + JSON.stringify(ev));
								},
								fail : function(ev) {
									Ti.API.error('in index, cppnSend, fail, message = ' + JSON.stringify(ev));
								}
							});
						},
						fail : function(e) {
							Ti.API.error('in index, cppnMerge, fail, message = ' + JSON.stringify(m));
						}
					});
				});
			}
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
