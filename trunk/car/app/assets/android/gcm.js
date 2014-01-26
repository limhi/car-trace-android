/*global Ti: true, require: true */

(function(service) {
	var isDebug = true;
	isDebug && Ti.API.info('into gcm js service!');
	try {
		var Alloy = require('alloy');
		isDebug && Ti.API.info('gcm js service!, reuqire alloy OK');
		isDebug && Ti.API.info('gcm js service!, Alloy.Globals.senderID = ' + Alloy.Globals.senderID);
	} catch(e) {
		Ti.API.error('gcm js service, error = ' + e);
	}
	var serviceIntent = service.getIntent();
	isDebug && Ti.API.info('gcm js service, serviceIntent.hasExtra(rowdata) = ' + serviceIntent.hasExtra('rowdata'));
	var rowdata = serviceIntent.hasExtra('rowdata') ? serviceIntent.getStringExtra('rowdata') : '';

	isDebug && Ti.API.info('gcm js service, serviceIntent.hasExtra(title) = ' + serviceIntent.hasExtra('title'));
	var title = serviceIntent.hasExtra('title') ? serviceIntent.getStringExtra('title') : '';

	isDebug && Ti.API.info('gcm js service, serviceIntent.hasExtra(message) = ' + serviceIntent.hasExtra('message'));
	var statusBarMessage = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '';
	var message = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '';

	var notificationId = (function() {
		// android notifications ids are int32
		// java int32 max value is 2.147.483.647, so we cannot use javascript millis timpestamp
		// let's make a valid timed based id:

		// - we're going to use hhmmssDYLX where (DYL=DaysYearLeft, and X=0-9 rounded millis)
		// - hh always from 00 to 11
		// - DYL * 2 when hour is pm
		// - after all, its max value is 1.159.597.289

		var str = '';
		var now = new Date();

		var hours = now.getHours();
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();
		str += (hours > 11 ? hours - 12 : hours) + '';
		str += minutes + '';
		str += seconds + '';

		var start = new Date(now.getFullYear(), 0, 0);
		var diff = now - start, oneDay = 1000 * 60 * 60 * 24;
		var day = Math.floor(diff / oneDay);
		// day has remaining days till end of the year
		str += day * (hours > 11 ? 2 : 1);

		var ml = (now.getMilliseconds() / 100) | 0;
		str += ml;

		return str | 0;
	})();

	isDebug && Ti.API.info('into service, notificationId = ' + notificationId);
	isDebug && Ti.API.info('into service, title = ' + title);
	isDebug && Ti.API.info('into service, message = ' + message);
	isDebug && Ti.API.info('into service, rowdata = ' + rowdata);

	// create launcher intent
	var ntfId = Ti.App.Properties.getInt('ntfId', 0);

	isDebug && Ti.API.info('into service, ntfId = ' + ntfId);
	if (title === 'sendGPS') {
		var ct = require('common_ct');
		try {
			var Alloy = require('alloy');
			var _ = require("alloy/underscore")._;
			var Backbone = require("alloy/backbone");

			// isDebug && Ti.API.info('gcm js service!, reuqire alloy OK');
			// isDebug && Ti.API.info('_.isObject(Alloy) = ' + _.isObject(Alloy));
			// isDebug && Ti.API.info('Alloy = ' + Alloy);
			//
			// isDebug && Ti.API.info('gcm js service!, reuqire underscore OK');
			// isDebug && Ti.API.info('_.isObject(_) = ' + _.isObject(_));
			// isDebug && Ti.API.info('_ = ' + _);
			//
			// isDebug && Ti.API.info('gcm js service!, reuqire backbone OK');
			// isDebug && Ti.API.info('_.isObject(Backbone) = ' + _.isObject(Backbone));
			// isDebug && Ti.API.info('Backbone = ' + Backbone);

			//Alloy.Globals.appEngineIP = 'https://car-trace.appspot.com/_ah/api/';
			// Alloy.Globals.appVersion = '1.0';
			// Alloy.Globals.senderID = '283904388775';
			// Alloy.Globals.registerID = '';
			// Alloy.Globals.deviceID = Ti.Platform.id;

			var ct = require('common_ct');
			// isDebug && Ti.API.info('gcm js service!, reuqire common_ct OK');
			// isDebug && Ti.API.info('_.isObject(ct) = ' + _.isObject(ct));
			// isDebug && Ti.API.info('ct = ' + ct);
			// ct.enableDebug();

			//Alloy.Collections.mycars = Alloy.createCollection('mycars');
			var mycars = Alloy.Collections.mycars;
			// isDebug && Ti.API.info('_.isObject(mycars) = ' + _.isObject(mycars));
			// isDebug && Ti.API.info('mycars = ' + mycars);
			// mycars.fetch();

			isDebug && Ti.API.info('mycars.length = ' + mycars.length);
		} catch(e) {
			Ti.API.error('gcm js service, error = ' + e);
		}
		if (mycars.length !== 0) {
			var mycar = mycars.at(0);
			// var mycar = mycat
			Ti.Geolocation.distanceFilter = 10;
			// set the granularity of the location event

			Ti.Geolocation.getCurrentPosition(function(e) {
				if (e.error) {
					Ti.API.error('gcm js service, get gps, error = ' + e.error);
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
						isDebug && Ti.API.info('gcm js service, cppnMerge, success, message = ' + JSON.stringify(e));
						var messageid = e.messageID;
						isDebug && Ti.API.info('gcm js service, cppnMerge, success, messageid = ' + messageid);

						ct.cppnSend({
							data : {
								carid : mycar.get('encodedKey'),
								messageid : messageid
							},
							success : function(ev) {
								isDebug && Ti.API.info('gcm js service, cppnSend, success, message = ' + JSON.stringify(ev));
								service.stop();
							},
							fail : function(ev) {
								Ti.API.error('gcm js service, cppnSend, fail, message = ' + JSON.stringify(ev));
								service.stop();
							}
						});
					},
					fail : function(e) {
						Ti.API.error('gcm js service, cppnMerge, fail, message = ' + JSON.stringify(m));
						service.stop();
					}
				});
			});
		}
	}

	var launcherIntent = Ti.Android.createIntent({
		// className : 'net.iamyellow.gcmjs.GcmjsActivity',
		className : 'org.luke.ct.car.CartraceCarActivity',
		action : 'action' + ntfId, // we need an action identifier to be able to track click on notifications
		packageName : Ti.App.id,
		flags : Ti.Android.FLAG_ACTIVITY_NEW_TASK | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
	});
	launcherIntent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
	launcherIntent.putExtra("ntfId", ntfId);
	// launcherIntent.putExtra("score", score);

	// create notification
	var pintent = Ti.Android.createPendingIntent({
		intent : launcherIntent
	});
	var notification = Ti.Android.createNotification({
		contentIntent : pintent,
		contentTitle : title,
		contentText : message,
		tickerText : statusBarMessage,
		icon : Ti.App.Android.R.drawable.appicon,
		flags : Ti.Android.ACTION_DEFAULT | Ti.Android.FLAG_AUTO_CANCEL | Ti.Android.FLAG_SHOW_LIGHTS
	});
	Ti.Android.NotificationManager.notify(notificationId, notification);

	// increase notification id
	ntfId += 1;
	Ti.App.Properties.setInt('ntfId', ntfId);
	isDebug && Ti.API.info('gcm js service end!');

	// service.stop();

})(Ti.Android.currentService);
