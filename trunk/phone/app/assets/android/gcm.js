/*global Ti: true, require: true */

(function(service) {
	var isDebug = true;
	isDebug && Ti.API.info('into gcm js service!');

	var Alloy = require('alloy');
	var _ = require("alloy/underscore")._;
	var Backbone = require("alloy/backbone");
	var ct = require('common_ct');
	try {
		isDebug && Ti.API.info('gcm js service!, reuqire alloy OK');
		isDebug && Ti.API.info('gcm js service!, Alloy.Globals.senderID = ' + Alloy.Globals.senderID);
		isDebug && Ti.API.info('gcm js service!, Alloy.Globals.appEngineIP = ' + Alloy.Globals.appEngineIP);
	} catch(e) {
		Ti.API.error('gcm js service, error = ' + e);
	}

	var serviceIntent = service.getIntent();
	isDebug && Ti.API.info('gcm js service, serviceIntent.hasExtra(rowdata) = ' + serviceIntent.hasExtra('rowdata'));
	var rowdata = serviceIntent.hasExtra('rowdata') ? serviceIntent.getStringExtra('rowdata') : '';

	isDebug && Ti.API.info('gcm js service, serviceIntent.hasExtra(title) = ' + serviceIntent.hasExtra('title'));
	var title = serviceIntent.hasExtra('title') ? serviceIntent.getStringExtra('title') : '';

	isDebug && Ti.API.info('gcm js service, serviceIntent.hasExtra(message) = ' + serviceIntent.hasExtra('message'));
	var message = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '';
	var statusBarMessage = message;

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

	isDebug && Ti.API.info('into service, title = ' + title);
	isDebug && Ti.API.info('into service, message = ' + message);
	isDebug && Ti.API.info('into service, rowdata = ' + rowdata);
	isDebug && Ti.API.info('into service, notificationId = ' + notificationId);
	// isDebug && Ti.API.info('into service, type = ' + type);

	// create launcher intent
	var ntfId = Ti.App.Properties.getInt('ntfId', 0);
	isDebug && Ti.API.info('into service, ntfId = ' + ntfId);

	if (title === 'backGPS') {
		var myphones = Alloy.Collections.myphones;
		myphones.fetch();

		Ti.API.info('myphones.length = ' + myphones.length);
		if (myphones.length !== 0) {
			var myphone = myphones.at(0);
		}
	}

	var launcherIntent = Ti.Android.createIntent({
		// className : 'net.iamyellow.gcmjs.GcmjsActivity',
		className : 'org.luke.ct.phone.CartracePhoneActivity',
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

	service.stop();

})(Ti.Android.currentService);
