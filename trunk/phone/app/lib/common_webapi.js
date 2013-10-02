//var args = arguments[0] || {};
var Alloy = require('alloy');

var isDebug = false;
exports.enableDebug = function() {
	isDebug = true;
};

exports.disableDebug = function() {
	isDebug = false;
};

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

function MyLoad(para) {
	var ip = para.data.ip;
	var url = para.data.url;
	var method = para.data.method;
	var json = para.data.json;

	var success = para.success;
	var fail = para.fail;

	var urlStr = "";
	urlStr = String.format("%s%s", para.data.ip, para.data.url);

	isDebug && Ti.API.info('in MyLoad, in common_webapi, urlStr = ' + urlStr);

	var xhr = Ti.Network.createHTTPClient();
	var sendObj = json;

	xhr.onload = function(e) {
		var respText = this.responseText;
		isDebug && Ti.API.info('onload in MyLoad, in common_webapi, this.responseText = ' + respText);
		try {
			var resObj = JSON.parse(respText);
			isDebug && Ti.API.info('onload in MyLoad, in common_webapi, resObj.status = ' + resObj.status);
			isDebug && Ti.API.info('onload in MyLoad, in common_webapi, resObj.result = ' + resObj.result);
			isDebug && Ti.API.info('onload in MyLoad, in common_webapi, resObj.code = ' + resObj.code);
			if (this.status === 200) {
				isDebug && Ti.API.info('send resObj to para.sucess');
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
		var respText = this.responseText;
		Ti.API.error('onerror in MyLoad, in common_webapi, this.responseText = ' + respText);
		fail(respText);
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

