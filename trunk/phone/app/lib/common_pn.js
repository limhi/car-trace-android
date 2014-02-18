//var args = arguments[0] || {};
var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var webapi = require('common_webapi');
var ct = require('common_ct');
var ImageFactory = require('ti.imagefactory');
var isDebug = false;

exports.enableDebug = function() {
	isDebug = true;
	webapi.enableDebug();
	ct.enableDebug();
};

exports.disableDebug = function() {
	isDebug = false;
	webapi.disableDebug();
	ct.disableDebug();
};

//data(, success, fail)
exports.sendGPS = function(para) {
	//檢查必要參數
	if (!para) {
		Ti.API.error('in common_pn	sendGPS, 必要參數para 未提供!');
		return;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('in common_pn->sendGPS, 必要參數para.data 未正確提供!');
		return;
	}
	if (!para.data.carid || !_.isString(para.data.carid)) {
		Ti.API.error('in common_pn->sendGPS, 必要參數para.data.carid 未正確提供!');
		return;
	}
	if (!_.isFunction(para.success)) {
		Ti.API.error('in common_pn->sendGPS, success is not a function');
		return ret;
	}
	if (!_.isFunction(para.fail)) {
		Ti.API.error('in common_pn->sendGPS, fail is not a function');
		return ret;
	}

	//取得參數
	var carid = para.data.carid;
	var success = para.success;
	var fail = para.fail;

	//設定呼叫參數
	Ti.Geolocation.distanceFilter = 10;
	// set the granularity of the location event

	Ti.Geolocation.getCurrentPosition(function(gpsEvent) {
		if (gpsEvent.error) {
			Ti.API.error('in common_pn->sendGPS, get gps, error = ' + gpsEvent.error);
			fail(gpsEvent.error);
			return;
		}

		var longitude = gpsEvent.coords.longitude;
		var latitude = gpsEvent.coords.latitude;
		var altitude = gpsEvent.coords.altitude;
		var heading = gpsEvent.coords.heading;
		var accuracy = gpsEvent.coords.accuracy;
		var speed = gpsEvent.coords.speed;
		var timestamp = gpsEvent.coords.timestamp;
		var altitudeAccuracy = gpsEvent.coords.altitudeAccuracy;

		// we use the above data the way we need it
		isDebug && Ti.API.info(String.format("in common_pn->sendGPS, longitude=%s, latitude=%s", longitude, latitude));
		ct.cppnMerge({
			data : {
				title : "backGPS",
				message : String.format("%s,%s", longitude, latitude),
				rowdata : {
					"type" : "cartype",
					"data" : "cardata"
				},
				carid : carid
			},
			success : function(e) {
				isDebug && Ti.API.info('in common_pn->sendGPS->cppnMerge, success, message = ' + JSON.stringify(e));
				var messageid = e.messageID;
				isDebug && Ti.API.info('in common_pn->sendGPS->cppnMerge, success, messageid = ' + messageid);

				ct.cppnSend({
					data : {
						carid : carid,
						messageid : messageid
					},
					success : function(ev) {
						isDebug && Ti.API.info('in common_pn->sendGPS->cppnMerge->cppnSend, success, message = ' + JSON.stringify(ev));
						success(ev);
					},
					fail : function(ev) {
						Ti.API.error('in common_pn->sendGPS->cppnMerge->cppnSend, fail, message = ' + JSON.stringify(ev));
						fail(ev);
					}
				});
			},
			fail : function(e) {
				Ti.API.error('in common_pn->sendGPS->cppnMerge, fail, message = ' + JSON.stringify(e));
				fail(e);
			}
		});
	});
};

exports.sendPicture = function(para) {
	//檢查必要參數
	if (!para) {
		Ti.API.error('in common_pn->sendPicture, 必要參數para 未提供!');
		return;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('in common_pn->sendPicture, 必要參數para.data 未正確提供!');
		return;
	}
	if (!para.data.carid || !_.isString(para.data.carid)) {
		Ti.API.error('in common_pn->sendPicture, 必要參數para.data.carid 未正確提供!');
		return;
	}
	if (!para.data.image || !_.isObject(para.data.image)) {
		Ti.API.error('in common_pn->sendPicture, 必要參數para.data.image 未正確提供!');
		return;
	}
	if (!_.isFunction(para.success)) {
		Ti.API.error('in common_pn->sendPicture, success is not a function');
		return ret;
	}
	if (!_.isFunction(para.fail)) {
		Ti.API.error('in common_pn->sendPicture, fail is not a function');
		return ret;
	}

	//取得參數
	var carid = para.data.carid;
	var image = para.data.image;
	var success = para.success;
	var fail = para.fail;

	//設定呼叫參數
	try {
		// 改變圖片的大小!
		// Ti.API.info('ImageFactory.QUALITY_MEDIUM = ' + ImageFactory.QUALITY_MEDIUM);
		image = ImageFactory.imageAsResized(image, {
			width : 1024,
			height : 768,
			quality : 1// 壓縮比例
		});
		isDebug && Ti.API.info("in common_pn->sendPicture, resize photo");
		// for (var key in image) {
		// if (key != 'text')
		// Ti.API.info('in index->doAutoPhoto->showCamera, success, image[' + key + '] = ' + JSON.stringify(image[key]));
		// }

		// 將圖片儲存起來，讓上傳時以圖片形式處理
		var timestamp = (new Date()).getTime();
		// Ti.API.info('in index->doAutoPhoto->showCamera, success, timestamp = ' + JSON.stringify(timestamp));
		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, timestamp + '.png');
		f.write(image);
		image = f;
		isDebug && Ti.API.info('in common_pn->sendPicture, save photo to file');

	} catch(exception) {
		Ti.API.error('in common_pn->sendPicture, exception = ' + exception);
		fail('in common_pn->sendPicture, exception = ' + exception);
		return;
	}

	ct.fetchImageURL({
		data : {
			devid : carid
		},
		success : function(model) {
			isDebug && Ti.API.info('in common_pn->sendPicture->fetchImageURL, success, message = ' + JSON.stringify(model));
			try {
				if (model && model.image_upload_url) {
					isDebug && Ti.API.info('in common_pn->sendPicture->fetchImageURL, success, model.image_upload_url = ' + model.image_upload_url);
					var url = model.image_upload_url;
					url = url.replace(/T430S/g, '192.168.101.176');
					isDebug && Ti.API.info('in common_pn->sendPicture->fetchImageURL, success, url = ' + url);

					ct.uploadImage({
						data : {
							uploadurl : url,
							devid : carid,
							myserial : 1,
							uploadimage : image
						},
						success : function(ev) {
							isDebug && Ti.API.info('in common_pn->sendPicture->fetchImageURL, success->uploadImage, success, message = ' + ev);
							success(ev);
						},
						fail : function(ev) {
							Ti.API.error('in common_pn->sendPicture->fetchImageURL, success->uploadImage, fail, message = ' + ev);
							fail('in common_pn->sendPicture->fetchImageURL, success->uploadImage, fail, message = ' + ev);
						}
					});
				} else {
					Ti.API.error('in common_pn->sendPicture->fetchImageURL, success, NO m.image_upload_url');
					fail('in common_pn->sendPicture->fetchImageURL, success, NO m.image_upload_url');
				}
			} catch(ex) {
				Ti.API.error('in common_pn->sendPicture->fetchImageURL, success, exception = ' + ex);
				fail('in common_pn->sendPicture->fetchImageURL, success, exception = ' + ex);
			}
		},
		fail : function(msg) {
			Ti.API.error('in common_pn->sendPicture->fetchImageURL, fail, error = ' + msg);
			fail('in common_pn->sendPicture->fetchImageURL, fail, error = ' + msg);
		}
	});
};
