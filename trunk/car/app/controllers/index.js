var args = arguments[0] || {};

var isDebug = true;

var ct = require('common_ct');
ct.enableDebug();
var pn = require('common_pn');
pn.enableDebug();
var dbcar = require('common_db_car');
// dbcar.enableDebug();
var mycars = Alloy.Collections.mycars;
var mymatches = Alloy.Collections.mymatches;

var isRunTasking = false;

(function(activity, gcm) {
	isDebug && Ti.API.info('into index gcm activity, gcm = ' + gcm);
	isDebug && Ti.API.info('into index gcm activity, gcm.data = ' + gcm.data);

	var intent = activity.intent;

	// var gcm = {};
	gcm.data = {};

	// HERE we catch the intent extras of our notifications
	if (intent && intent.hasExtra('title')) {
		// and then we'll use 'data' property to pass info to the app (see pendingData lines of the 1st snippet)
		// gcm.data = {
		// ntfId : intent.getIntExtra('ntfId', 0)
		// };
		var title = intent.getStringExtra('title');
		var message = intent.getStringExtra('message');
		var rowdataString = intent.getStringExtra('rowdata');
		var rowdata = JSON.parse(rowdataString);
		isDebug && Ti.API.info('in callback, title = ' + JSON.stringify(title));
		isDebug && Ti.API.info('in callback, rowdata = ' + JSON.stringify(rowdata));
		if (title === 'sendGPS') {
			sendGPS();
		} else if (title === 'sendPicture') {
			sendPicture();
		}
	}

	isDebug && Ti.API.info('index gcm activity, gcm.data.ntfId = ' + gcm.data.ntfId);
	isDebug && Ti.API.info('index gcm activity, gcm.data.data = ' + gcm.data.data);
	isDebug && Ti.API.info('index gcm activity, gcm.isLauncherActivity = ' + gcm.isLauncherActivity);
	isDebug && Ti.API.info('index gcm activity, gcm.mainActivityClassName = ' + gcm.mainActivityClassName);

	isDebug && Ti.API.info('index gcm activity end');
})(Ti.Android.currentActivity, require('net.iamyellow.gcmjs'));

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
			isDebug && Ti.API.info('in index->doRegister, success, message = ' + JSON.stringify(m));
			dbcar.setOnlyItem(mycars, m);
			isDebug && Ti.API.info("in index->doRegister, success, m.encodedKey = " + m.encodedKey);
			Ti.App.Properties.setString('carid', m.encodedKey);
			isDebug && Ti.API.info("in index->doRegister, success, Alloy.Globals.appEngineIP = " + Alloy.Globals.appEngineIP);
			Ti.App.Properties.setString('ip', Alloy.Globals.appEngineIP);
			GUISetup();
		},
		fail : function(m) {
			Ti.API.error('in index->doRegister, fail, message = ' + JSON.stringify(m));
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
	isDebug && Ti.API.info('in index->GUISetup');

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
	isDebug && Ti.API.info('in index->GUISetup end');
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
		},
		callback : function(ev) {
			// when a gcm notification is received WHEN the app IS IN FOREGROUND
			isDebug && Ti.API.info('******* callback, ' + JSON.stringify(ev));
			if (ev && ev.title && ev.rowdata) {
				var title = ev.title;
				var rowdata = ev.rowdata;
				isDebug && Ti.API.info('in callback, title = ' + JSON.stringify(title));
				isDebug && Ti.API.info('in callback, rowdata = ' + JSON.stringify(rowdata));
				if (title === 'sendGPS') {
					sendGPS();
				} else if (title === 'sendPicture') {
					sendPicture();
				}
			}
			//alert('hellow push notification!');
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

function sendGPS() {
	Ti.API.error('in sendGPS, isRunTasking = ' + isRunTasking);
	//已經有任務在運行，就5秒後再執行一次
	if (isRunTasking) {
		setTimeout(sendGPS, 5000);
		return;
	}

	Ti.API.error('in sendGPS, runing task......');
	isRunTasking = true;

	isDebug && Ti.API.info('in index->sendGPS, mycars.length = ' + mycars.length);
	if (mycars.length !== 0) {
		var mycar = mycars.at(0);
		var carid = mycar.get('encodedKey');
		// var mycar = mycat
		pn.sendGPS({
			data : {
				carid : carid
			},
			success : function(e) {
				isDebug && Ti.API.info('in index->sendGPS, OK, message : ' + JSON.stringify(e));
				$.MessageTA.value = 'sendGPS OK, get message : ' + JSON.stringify(e);
				isRunTasking = false;
			},
			fail : function(e) {
				Ti.API.error('in index->sendGPS, FAIL, error = ' + e);
				$.MessageTA.value = 'sendGPS FAIL, get message : ' + JSON.stringify(e);
				isRunTasking = false;
			}
		});
	} else {
		isRunTasking = false;
	}
}

function sendPicture() {
	Ti.API.error('in sendPicture, isRunTasking = ' + isRunTasking);
	//已經有任務在運行，就三秒後再執行一次
	if (isRunTasking) {
		setTimeout(sendPicture, 5000);
		return;
	}
	Ti.API.error('in sendPicture, runing task......');
	isRunTasking = true;

	var takePhotoButton = Ti.UI.createButton({
		title : "Take Photo",
		bottom : 20
	});
	takePhotoButton.addEventListener('click', function(e) {
		Ti.Media.takePicture();
	});

	// var cameraType = Ti.UI.createButton({
	// title : "rear",
	// bottom : 20
	// });
	// cameraType.addEventListener('click', function() {
	// if (Ti.Media.camera == Ti.Media.CAMERA_FRONT) {
	// cameraType.title = "front";
	// Ti.Media.switchCamera(Ti.Media.CAMERA_REAR);
	// } else {
	// cameraType.title = "rear";
	// Ti.Media.switchCamera(Ti.Media.CAMERA_FRONT);
	// }
	// });

	var overlayView = Ti.UI.createView();
	overlayView.layout = 'vertical';
	overlayView.add(takePhotoButton);
	// overlayView.add(cameraType);
	// var cameras = Ti.Media.availableCameraMediaTypes;
	// for (var c = 0; c < cameras.length; c++) {
	// // if we have a rear camera ... we add switch button
	// if (cameras[c] == Ti.Media.CAMERA_REAR) {
	// overlayView.add(cameraType);
	// break;
	// }
	// }

	Titanium.Media.showCamera({
		overlay : overlayView,
		success : function(event) {
			isDebug && Ti.API.info("captured photo");

			var carid = mycars.at(0).get('encodedKey');

			var cropRect = event.cropRect;
			var image = event.media;

			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				pn.sendPicture({
					data : {
						carid : carid,
						image : image
					},
					success : function(e) {
						isDebug && Ti.API.info('in index->sendPicture->showCamera success->pn.sendPicture, success, message = ' + e);
						$.MessageTA.value = 'in index->sendPicture->showCamera success->pn.sendPicture, success, message = ' + JSON.stringify(e);
						isRunTasking = false;
					},
					fail : function(e) {
						Ti.API.error('in index->sendPicture->showCamera success->pn.sendPicture, fail, message = ' + e);
						$.MessageTA.value = 'in index->sendPicture->showCamera success->pn.sendPicture, fail, message = ' + JSON.stringify(e);
						isRunTasking = false;
					}
				});

			} else {
				Ti.API.error('in index->sendPicture->showCamera success, got the wrong type back =' + event.mediaType);
				$.MessageTA.value = 'in index->sendPicture->showCamera success, got the wrong type back =' + event.mediaType;
				isRunTasking = false;
			}
		},
		cancel : function(cancel) {
			Ti.API.error("in index->sendPicture->showCamera, cancel, message = " + cancel);
			$.MessageTA.value = "in index->sendPicture->showCamera, cancel, message = " + cancel;
			isRunTasking = false;
		},
		error : function(error) {
			Ti.API.error("in index->sendPicture->showCamera, error, message = " + error);
			$.MessageTA.value = "in index->sendPicture->showCamera, error, message = " + error;
			isRunTasking = false;
		},
		saveToPhotoGallery : true
	});

	setTimeout(function() {
		isDebug && Ti.API.info('in index->sendPicture->setTimeout');
		Ti.Media.takePicture();
	}, 2000);
}

// in order to unregister:
// require('net.iamyellow.gcmjs').unregister();
$.index.addEventListener('open', GUIReady);
$.index.addEventListener('focus', GUISetup);
isDebug && Ti.API.info('init done');

$.index.open();
