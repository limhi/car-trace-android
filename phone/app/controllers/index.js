var args = arguments[0] || {};

var isDebug = true;

var ct = require('common_ct');
ct.enableDebug();
var msg = require('common_db_message');
msg.enableDebug();

var dbphone = require('common_db_phone');
// dbphone.enableDebug();
var myphones = Alloy.Collections.myphones;
var mymatches = Alloy.Collections.mymatches;
var mymessages = Alloy.Collections.mymessages;

var longitude, latitude, carID;

(function(activity, gcm) {
	isDebug && Ti.API.info('into index gcm activity!');

	var intent = activity.intent;

	// var gcm = {};
	// gcm.data = {};
	if (gcm)
		if (!gcm.data)
			gcm.data = {};
	// HERE we catch the intent extras of our notifications
	if (intent.hasExtra('ntfId')) {
		// and then we'll use 'data' property to pass info to the app (see pendingData lines of the 1st snippet)
		// gcm.data = {
		// ntfId : intent.getIntExtra('ntfId', 0)
		// };
		gcm.data.ntfId = intent.getIntExtra('ntfId', 0);
	}

	isDebug && Ti.API.info('index gcm activity, gcm.data.ntfId = ' + gcm.data.ntfId);
	isDebug && Ti.API.info('index gcm activity, gcm.data.data = ' + gcm.data.data);
	isDebug && Ti.API.info('index gcm activity, gcm.isLauncherActivity = ' + gcm.isLauncherActivity);
	isDebug && Ti.API.info('index gcm activity, gcm.mainActivityClassName = ' + gcm.mainActivityClassName);

	isDebug && Ti.API.info('index gcm activity end');
})(Ti.Android.currentActivity, require('net.iamyellow.gcmjs'));

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
			isDebug && Ti.API.info('in index->doRegister, success, message = ' + JSON.stringify(m));
			dbphone.setOnlyItem(myphones, m);
			GUISetup();
		},
		fail : function(m) {
			Ti.API.error('in index->doRegister, fail, message = ' + JSON.stringify(m));
			GUISetup();
		}
	});
}

function doVersion(e) {
	isDebug && Ti.API.info('in index, doVersion');
	msg.removeAll(mymessages);
	alert("尚未實作doVersion");
}

function doCarNumber(e) {
	isDebug && Ti.API.info('in index, doCarNumber');
	var carid = '';
	var modelArray = mymatches.where({
		'selected' : 'Y'
	});
	if (modelArray.length > 0) {
		var mymatch = modelArray[0];
		isDebug && Ti.API.info('in index, doCarNumber, mymatch = ' + JSON.stringify(mymatch));
		carid = mymatch.get('carID');
	}

	var myev = {
		carID : carid,
		addTime : "19700101000000000"
	};

	handlePicture({
		rowdata : JSON.stringify(myev)
	});

	alert("尚未實作doCarNumber");
}

function doSettings(e) {
	isDebug && Ti.API.info('in index, doSettings');
	var settingsController = Alloy.createController('settings/index_table', {
		isDebug : true
	});
	settingsController && settingsController.getView() && settingsController.getView().open();
}

function doMatch(e) {
	isDebug && Ti.API.info('in index, doMatch');
	var matchController = Alloy.createController('settings/match', {
		isDebug : true
	});
	matchController && matchController.getView() && matchController.getView().open();
}

function doGPS_Fetch(e) {
	isDebug && Ti.API.info('in index, doGPS_Fetch');
	var carid = '';
	var modelArray = mymatches.where({
		'selected' : 'Y'
	});
	if (modelArray.length > 0) {
		var mymatch = modelArray[0];
		isDebug && Ti.API.info('in index, doGPS_Fetch, mymatch = ' + JSON.stringify(mymatch));
		carid = mymatch.get('carID');
	}
	var phoneid = myphones.at(0).get('encodedKey');

	mySendPushNotification(carid, phoneid, "sendGPS", 'request for GPS', {
		"type" : "mytype",
		"data" : "mydata"
	});
}

function doPicture_Fetch(e) {
	isDebug && Ti.API.info('in index, doPicture_Fetch');
	var carid = '';
	var modelArray = mymatches.where({
		'selected' : 'Y'
	});
	if (modelArray.length > 0) {
		var mymatch = modelArray[0];
		isDebug && Ti.API.info('in index, doPicture_Fetch, mymatch = ' + JSON.stringify(mymatch));
		carid = mymatch.get('carID');
	}
	var phoneid = myphones.at(0).get('encodedKey');

	mySendPushNotification(carid, phoneid, "sendPicture", 'request for Picture', {
		"type" : "mytype",
		"data" : "mydata"
	});
}

function mySendPushNotification(carid, phoneid, title, message, rowdata) {
	isDebug && Ti.API.info('in index, mySendPushNotification');

	isDebug && Ti.API.info('in index->mySendPushNotification, carid = ' + JSON.stringify(carid));
	isDebug && Ti.API.info('in index->mySendPushNotification, phoneid = ' + JSON.stringify(phoneid));
	isDebug && Ti.API.info('in index->mySendPushNotification, title = ' + JSON.stringify(title));
	isDebug && Ti.API.info('in index->mySendPushNotification, message = ' + JSON.stringify(message));
	isDebug && Ti.API.info('in index->mySendPushNotification, rowdata = ' + JSON.stringify(rowdata));
	ct.pcpnMerge({
		data : {
			title : title,
			message : message,
			rowdata : rowdata,
			phoneid : phoneid,
			carid : carid
		},
		success : function(e) {
			isDebug && Ti.API.info('in index->mySendPushNotification->pcpnMerge, success, message = ' + JSON.stringify(e));
			var messageid = e.messageID;
			isDebug && Ti.API.info('in index->mySendPushNotification->pcpnMerge, success, messageid = ' + messageid);

			ct.pcpnSend({
				data : {
					phoneid : phoneid,
					messageid : messageid
				},
				success : function(ev) {
					isDebug && Ti.API.info('in index->mySendPushNotification->pcpnMerge, success->pcpnSend, success, title = ' + title + ', message = ' + JSON.stringify(ev));
					$.MessageTA.value = 'in index->mySendPushNotification->pcpnMerge, success->pcpnSend, success, title = ' + title + ', message = ' + JSON.stringify(ev);
				},
				fail : function(ev) {
					Ti.API.error('in index->mySendPushNotification->pcpnMerge, success->pcpnSend, fail, title = ' + title + ', message = ' + JSON.stringify(ev));
					$.MessageTA.value = 'in index->mySendPushNotification->pcpnMerge, success->pcpnSend, fail, title = ' + title + ', message = ' + JSON.stringify(ev);
				}
			});
		},
		fail : function(e) {
			Ti.API.error('in index->mySendPushNotification->pcpnMerge, fail, title = ' + title + ', message = ' + JSON.stringify(m));
			$.MessageTA.value += '\nin index->mySendPushNotification->pcpnMerge, fail, title = ' + title + ', message = ' + JSON.stringify(m);
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
		data : 'geo:' + latitude + ',' + longitude
	});
	Ti.Android.currentActivity.startActivity(intent);
}

function GUISetup() {
	$.RegisterB.enabled = true;
	$.MatchB.enabled = true;
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
			$.Picture_FetchB.enabled = true;
		}
	}

	if (mymatches.length > 0) {
		var modelArray = mymatches.where({
			'selected' : 'Y'
		});
		if (modelArray.length > 0) {
			var mymatch = modelArray[0];
			isDebug && Ti.API.info('in GUISetup, mymatch = ' + JSON.stringify(mymatch));
			$.CarNumberL.text = mymatch.get('showname');
		}
	}
}

function handleGPS(e) {
	if (e && e.message) {
		var message = e.message;

		var myArr = message.split(',');
		if (myArr.length === 2) {
			longitude = myArr[0];
			latitude = myArr[1];
		}
		$.MapB.visible = true;

		alert('get message : ' + JSON.stringify(e));
	}
}

function handlePicture(e) {
	if (e && e.rowdata) {
		var rowdataStr = e.rowdata;
		var rowdata = JSON.parse(rowdataStr);
		var carID = rowdata.carID;
		var addTime = rowdata.addTime;
		Ti.API.info('in index->handlePicture, carID = ' + carID);
		Ti.API.info('in index->handlePicture, addTime = ' + addTime);
		var messageArray = mymessages.where({
			'carID' : carID,
			'addTime' : addTime
		});

		if (messageArray && messageArray.length == 0) {
			// 找到該carid最後的一筆記錄
			messageArray = mymessages.where({
				'carID' : carID
			});
			// max_.max(list, [iterator], [context])
			// 返回list中的最大值。如果传递iterator参数，iterator将作为list排序的依据。->handlePicture, exception = ' + ex);
			var mymax = _.max(messageArray, function(model) {
				return model.get('addTime');
			});
			var lastTime;
			var phoneID = myphones.at(0).get('encodedKey');
			//如果有找到記錄
			Ti.API.info('in index->handlePicture->duList, mymax = ' + JSON.stringify(mymax));
			if (_.isObject(mymax) && mymax.get('addTime'))
				lastTime = mymax.get('addTime');

			Ti.API.info('in index->handlePicture->duList, carID = ' + carID);
			Ti.API.info('in index->handlePicture->duList, phoneID = ' + phoneID);
			Ti.API.info('in index->handlePicture->duList, lastTime = ' + lastTime);

			ct.duList({
				data : {
					carid : carID,
					phoneid : phoneID,
					lastTime : lastTime
				},
				success : function(ev) {
					Ti.API.info('in index->handlePicture->duList, success message = ' + ev);
					var items = ev.items;
					_.each(items, function(item) {
						Ti.API.info('in index->handlePicture->duList, success->each item= ' + JSON.stringify(item));
						// url = url.replace(/T430S/g, '192.168.101.176');
						msg.addItem(mymessages, {
							encodedKey : item.encodedKey,
							carID : carID,
							phoneID : phoneID,
							messageType : "pic",
							mySerial : item.mySerial,
							blobKey : item.blob_key,
							// gps : item.encodedKey,
							picture : item.serving_url.replace(/0.0.0.0/g, '192.168.101.176'),
							// settings : item.encodedKey,
							addTime : item.addTime,
							modTime : item.addTime
						});
					});
				},
				fail : function(ev) {
					Ti.API.error('in index->handlePicture->duList, error message = ' + ev);
				}
			});
		}
		alert('get message : ' + JSON.stringify(e));
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
		isDebug && Ti.API.info('******* data (started) ' + JSON.stringify(pendingData));
	}

	gcm.registerForPushNotifications({
		success : function(ev) {
			// on successful registration
			isDebug && Ti.API.info('******* success, ' + ev.deviceToken);
			Alloy.Globals.registerID = ev.deviceToken;
			doRegister();
		},
		error : function(ev) {
			// when an error occurs
			isDebug && Ti.API.info('******* error, ' + ev.error);
			GUISetup();
		},
		callback : function(ev) {
			// when a gcm notification is received WHEN the app IS IN FOREGROUND
			isDebug && Ti.API.info('******* callback, ' + JSON.stringify(ev));
			// $.GPSInfoTA.visible = true;
			// $.GPSInfoTA.value = 'get message : ' + JSON.stringify(ev);
			$.MessageTA.value = 'get message : ' + JSON.stringify(ev);
			if (ev && ev.title && ev.message) {
				var title = ev.title;
				var message = ev.message;
				if (title === "backGPS") {
					handleGPS(ev);
				} else if (title === "backPicture") {
					handlePicture(ev);
				}
			}
		},
		unregister : function(ev) {
			// on unregister
			isDebug && Ti.API.info('******* unregister, ' + ev.deviceToken);
		},
		data : function(data) {
			// if we're here is because user has clicked on the notification
			// and we set extras in the intent
			// and the app WAS RUNNING (=> RESUMED)
			// (again don't worry, we'll see more of this later)
			isDebug && Ti.API.info('******* data (resumed) ' + JSON.stringify(data));
		}
	});
}

// in order to unregister:
// require('net.iamyellow.gcmjs').unregister();
$.index.addEventListener('open', GUIReady);
$.index.addEventListener('focus', GUISetup);
isDebug && Ti.API.info('init done');

$.index.open();

// var myev = {
// carID : "agljYXItdHJhY2VyEwsSBkNhclJlZxiAgICAgICtCww",
// addTime : "19700101000000000"
// };
//
// handlePicture({
// rowdata : JSON.stringify(myev)
// });
