//var args = arguments[0] || {};
var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var isDebug = false;
exports.enableDebug = function() {
	isDebug = true;
};

exports.disableDebug = function() {
	isDebug = false;
};

var retryMax = 3;

//ip, url, method, json, success, fail, update
exports.connect = function(para) {
	var checkValid = isValidPara(para);
	if (!checkValid.isValid) {
		Ti.API.info('connect in common_webapi, 參數不正確!');
		return;
	}
	para = checkValid.para;
	var ip = para.data.ip;
	var url = para.data.url;
	var method = para.data.method;
	var json = para.data.json;

	var success = para.success;
	var fail = para.fail;

	MyLoad(para);
};

function MyLoad(para, retryCount) {
	var ip = para.data.ip;
	var url = para.data.url;
	var method = para.data.method;
	var json = para.data.json;

	var success = para.success;
	var fail = para.fail;

	if (!retryCount)
		retryCount = 0;

	var urlStr = "";
	urlStr = String.format("%s%s", para.data.ip, para.data.url);

	isDebug && Ti.API.info('in MyLoad, in common_webapi, urlStr = ' + urlStr);

	var xhr = Ti.Network.createHTTPClient();
	var sendObj = json;

	xhr.onload = function(e) {
		var respText = this.responseText;
		isDebug && Ti.API.info('onload in MyLoad, in common_webapi, this.responseText = ' + respText);
		try {
			if (this.status === 200) {
				var resObj = JSON.parse(respText);
				isDebug && Ti.API.info('onload in MyLoad, in common_webapi, resObj.status = ' + resObj.status);
				isDebug && Ti.API.info('onload in MyLoad, in common_webapi, resObj.result = ' + resObj.result);
				isDebug && Ti.API.info('onload in MyLoad, in common_webapi, resObj.code = ' + resObj.code);
				isDebug && Ti.API.info('send resObj to para.success');
				success(resObj);
			} else {
				isDebug && Ti.API.info('send respText to para.fail');
				fail(respText);
			}
		} catch(error) {
			fail(error);
		}
	};

	xhr.onerror = function(e) {
		Ti.API.error("onerror in MyLoad, in common_webapi, error : " + JSON.stringify(e));
		var respText = this.responseText;
		Ti.API.error('onerror in MyLoad, in common_webapi, this.responseText = ' + respText);
		retryCount++;
		if (retryCount <= retryMax) {
			Ti.API.error('onerror in MyLoad, retryCount = ' + retryCount);
			MyLoad(para, retryCount);
		} else {
			Ti.API.error('onerror in MyLoad, retryCount: ' + retryCount + ' over retryMax :' + retryMax);
			Ti.API.error('send respText to para.fail');
			fail(respText);
		}
	};

	xhr.open(method, urlStr);
	if (!para.data.json || !_.isObject(para.data.json)) {
		xhr.setRequestHeader("Content-Type", "text/plain");
	} else {
		xhr.setRequestHeader("Content-Type", "application/json");
	}
	xhr.setTimeout(5000);
	xhr.send(JSON.stringify(sendObj));
};

function isValidPara(para) {
	var ret = {
		isValid : false
	};
	if (!para) {
		Ti.API.error('isValidPara, in common_webapi, can not get para ');
		return ret;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('isValidPara, in common_webapi, can not get data');
		return;
	}
	if (!para.data.ip) {
		Ti.API.error('isValidPara, in common_webapi, can not get ip');
		return;
	}
	if (!para.data.url) {
		Ti.API.error('isValidPara, in common_webapi, can not get url');
		return;
	}
	if (!para.data.method) {
		Ti.API.error('isValidPara, in common_webapi, can not get method');
		return;
	}
	if (!para.data.json || !_.isObject(para.data.json)) {
		Ti.API.war('isValidPara, in common_webapi, can not get object json');
		//return ret;
	}
	if (!para.success) {
		isDebug && Ti.API.info('isValidPara, in common_webapi, can not get function success, use default');
		para.success = function() {
			Ti.API.warn('function sucess is not defined!');
		};
		//return ret;
	}
	if (!_.isFunction(para.success)) {
		Ti.API.error('isValidPara, in common_webapi, success is not a function');
		return ret;
	}
	if (!para.fail) {
		isDebug && Ti.API.info('isValidPara, in common_webapi, can not get function fail, use default');
		para.fail = function() {
			Ti.API.warn('function fail is not defined!');
		};
		//return ret;
	}
	if (!_.isFunction(para.fail)) {
		Ti.API.error('isValidPara, in common_webapi, fail is not a function');
		return ret;
	}

	ret.isValid = true;
	ret.para = para;

	return ret;
};

//ip, url, method, json, success, fail, update
exports.upload = function(para) {
	var checkValid = isUploadValidPara(para);
	if (!checkValid.isValid) {
		Ti.API.info('upload in common_webapi, 參數不正確!');
		return;
	}
	para = checkValid.para;
	// var ip = para.data.ip;
	var url = para.data.url;
	//var method = para.data.method;
	var json = para.data.json;

	var success = para.success;
	var fail = para.fail;

	MyUploadLoad(para);
};

function MyUploadLoad(para, retryCount) {
	//var ip = para.data.ip;
	var url = para.data.url;
	var method = 'POST';
	//var method = para.data.method;
	var json = para.data.json;
	var devid = json.devid;
	var myserial = json.myserial;
	var image = json.image;

	var success = para.success;
	var fail = para.fail;

	if (!retryCount)
		retryCount = 0;

	// var urlStr = "";
	// urlStr = String.format("%s%s", para.data.ip, para.data.url);

	isDebug && Ti.API.info('in MyUploadLoad, in common_webapi, url = ' + url);

	var xhr = Ti.Network.createHTTPClient();

	xhr.onload = function(e) {
		var respText = this.responseText;
		isDebug && Ti.API.info('onload in MyUploadLoad, in common_webapi, this.responseText = ' + respText);
		try {
			isDebug && Ti.API.info('onload in MyUploadLoad, in common_webapi, respText = ' + respText);
			if (this.status === 200) {
				var resObj = JSON.parse(respText);
				isDebug && Ti.API.info('send resObj to para.success');
				success(resObj);
			} else {
				isDebug && Ti.API.info('send respText to para.fail');
				fail(respText);
			}
		} catch(error) {
			fail(error);
		}
	};

	xhr.onerror = function(e) {
		Ti.API.error("onerror in MyUploadLoad, in common_webapi, error : " + JSON.stringify(e));
		var respText = this.responseText;
		Ti.API.error('onerror in MyUploadLoad, in common_webapi, this.responseText = ' + respText);
		retryCount++;
		if (retryCount <= retryMax) {
			Ti.API.error('onerror in MyUploadLoad, retryCount = ' + retryCount);
			MyUploadLoad(para, retryCount);
		} else {
			Ti.API.error('onerror in MyUploadLoad, retryCount: ' + retryCount + ' over retryMax :' + retryMax);
			Ti.API.error('send respText to para.fail');
			fail(respText);
		}
	};

	xhr.open(method, url);

	// if (!para.data.json || !_.isObject(para.data.json)) {
	// xhr.setRequestHeader("Content-Type", "text/plain");
	// } else {
	// xhr.setRequestHeader("Content-Type", "application/json");
	// }

	xhr.setTimeout(5000);
	xhr.send({
		myFile : image,
		devID : devid,
		mySerial : myserial
	});
};

function isUploadValidPara(para) {
	var ret = {
		isValid : false
	};
	if (!para) {
		Ti.API.error('isUploadValidPara, in common_webapi, can not get para ');
		return ret;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('isUploadValidPara, in common_webapi, can not get data');
		return;
	}
	if (!para.data.url) {
		Ti.API.error('isUploadValidPara, in common_webapi, can not get url');
		return;
	}
	if (!para.data.json || !_.isObject(para.data.json)) {
		Ti.API.error('isUploadValidPara, in common_webapi, can not get object json');
		return ret;
	}
	if (!para.data.json.devid || !_.isString(para.data.json.devid)) {
		Ti.API.error('isUploadValidPara, in common_webapi, can not get devid');
		return ret;
	}
	if (!para.data.json.devid || !_.isString(para.data.json.devid)) {
		Ti.API.error('isUploadValidPara, in common_webapi, can not get devid');
		return ret;
	}
	if (!para.data.json.myserial || !_.isNumber(para.data.json.myserial)) {
		Ti.API.error('isUploadValidPara, in common_webapi, can not get myserial');
		return ret;
	}
	if (!para.data.json.image || !_.isObject(para.data.json.image)) {
		Ti.API.error('isUploadValidPara, in common_webapi, can not get image');
		return ret;
	}
	if (!para.success) {
		isDebug && Ti.API.info('isValidPara, in common_webapi, can not get function success, use default');
		para.success = function() {
			Ti.API.warn('function sucess is not defined!');
		};
		//return ret;
	}
	if (!_.isFunction(para.success)) {
		Ti.API.error('isUploadValidPara, in common_webapi, success is not a function');
		return ret;
	}
	if (!para.fail) {
		isDebug && Ti.API.info('isUploadValidPara, in common_webapi, can not get function fail, use default');
		para.fail = function() {
			Ti.API.warn('function fail is not defined!');
		};
		//return ret;
	}
	if (!_.isFunction(para.fail)) {
		Ti.API.error('isUploadValidPara, in common_webapi, fail is not a function');
		return ret;
	}

	ret.isValid = true;
	ret.para = para;

	return ret;
};