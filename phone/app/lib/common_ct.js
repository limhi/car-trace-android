//var args = arguments[0] || {};
var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var webapi = require('common_webapi');
var isDebug = false;

exports.enableDebug = function() {
	isDebug = true;
	webapi.enableDebug();
};

exports.disableDebug = function() {
	isDebug = false;
	webapi.disableDebug();
};

//data(, success, fail)
exports.cregMerge = function(para) {
	//檢查必要參數
	if (!para) {
		Ti.API.error('必要參數para 未提供!');
		return;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('必要參數para.data 未正確提供!');
		return;
	}

	//取得參數

	//設定呼叫參數
	var URL = "ctreg/v1/postCarRegisterMerge";

	var sendObj = para.data;
	//呼叫web api warpper
	webapi.connect({
		data : {
			ip : Alloy.Globals.appEngineIP,
			url : URL,
			method : 'post',
			json : sendObj
		},
		success : para.success,
		fail : para.fail,
	});
};

//data(, success, fail)
exports.pregMerge = function(para) {
	//檢查必要參數
	if (!para) {
		Ti.API.error('必要參數para 未提供!');
		return;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('必要參數para.data 未正確提供!');
		return;
	}

	//取得參數

	//設定呼叫參數
	var URL = "ctreg/v1/postPhoneRegisterMerge";

	var sendObj = para.data;
	//呼叫web api warpper
	webapi.connect({
		data : {
			ip : Alloy.Globals.appEngineIP,
			url : URL,
			method : 'post',
			json : sendObj
		},
		success : para.success,
		fail : para.fail,
	});
};

//data.carid(, success, fail)
exports.cprandomMerge = function(para) {
	//檢查必要參數
	if (!para) {
		Ti.API.error('必要參數para 未提供!');
		return;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('必要參數para.data 未正確提供!');
		return;
	}
	if (!para.data.carid || !_.isString(para.data.carid)) {
		Ti.API.error('必要參數para.data.carid 未正確提供!');
		return;
	}

	//取得參數
	var carid = para.data.carid;

	//設定呼叫參數
	var URL = "ctrandom/v1/postCPRNMerge";
	URL = String.format("%s/%s", URL, carid);
	var sendObj = {};

	//呼叫web api warpper
	webapi.connect({
		data : {
			ip : Alloy.Globals.appEngineIP,
			url : URL,
			method : 'post',
			json : sendObj
		},
		success : para.success,
		fail : para.fail,
	});
};

//data.carid(, success, fail)
exports.cprandomMatch = function(para) {
	//檢查必要參數
	if (!para) {
		Ti.API.error('必要參數para 未提供!');
		return;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('必要參數para.data 未正確提供!');
		return;
	}
	if (!para.data.phoneid || !_.isString(para.data.phoneid)) {
		Ti.API.error('必要參數para.data.phoneid 未正確提供!');
		return;
	}
	if (!para.data.randomid || !_.isString(para.data.randomid)) {
		Ti.API.error('必要參數para.data.randomid 未正確提供!');
		return;
	}

	//取得參數
	var phoneid = para.data.phoneid;
	var randomid = para.data.randomid;

	//設定呼叫參數
	var URL = "ctrandom/v1/postCPRNMatch";
	URL = String.format("%s/%s/%s", URL, phoneid, randomid);
	var sendObj = {};

	//呼叫web api warpper
	webapi.connect({
		data : {
			ip : Alloy.Globals.appEngineIP,
			url : URL,
			method : 'post',
			json : sendObj
		},
		success : para.success,
		fail : para.fail,
	});
};

//data(, success, fail)
exports.pcpnMerge = function(para) {
	//檢查必要參數
	if (!para) {
		Ti.API.error('必要參數para 未提供!');
		return;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('必要參數para.data 未正確提供!');
		return;
	}
	if (!para.data.phoneid || !_.isString(para.data.phoneid)) {
		Ti.API.error('必要參數para.data.phoneid 未正確提供!');
		return;
	}
	if (!para.data.title || !_.isString(para.data.title)) {
		Ti.API.error('必要參數para.data.title 未正確提供!');
		return;
	}
	if (!para.data.message || !_.isString(para.data.message)) {
		Ti.API.error('必要參數para.data.message 未正確提供!');
		return;
	}
	if (!para.data.rowdata || !_.isObject(para.data.rowdata)) {
		Ti.API.error('必要參數para.data.rowdata 未正確提供!');
		return;
	}

	//取得參數
	var phoneid = para.data.phoneid;
	var title = para.data.title;
	var message = para.data.message;
	var rowdata = para.data.rowdata;

	//設定呼叫參數
	var URL = "ctpush/v1/postPCPushNotification";
	URL = String.format("%s/%s", URL, phoneid);

	var sendObj = {
		title : title,
		message : message,
		rowdata : rowdata
	};
	//呼叫web api warpper
	webapi.connect({
		data : {
			ip : Alloy.Globals.appEngineIP,
			url : URL,
			method : 'post',
			json : sendObj
		},
		success : para.success,
		fail : para.fail,
	});
};

//data(, success, fail)
exports.cppnMerge = function(para) {
	//檢查必要參數
	if (!para) {
		Ti.API.error('必要參數para 未提供!');
		return;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('必要參數para.data 未正確提供!');
		return;
	}
	if (!para.data.carid || !_.isString(para.data.carid)) {
		Ti.API.error('必要參數para.data.carid 未正確提供!');
		return;
	}
	if (!para.data.title || !_.isString(para.data.title)) {
		Ti.API.error('必要參數para.data.title 未正確提供!');
		return;
	}
	if (!para.data.message || !_.isString(para.data.message)) {
		Ti.API.error('必要參數para.data.message 未正確提供!');
		return;
	}
	if (!para.data.rowdata || !_.isObject(para.data.rowdata)) {
		Ti.API.error('必要參數para.data.rowdata 未正確提供!');
		return;
	}

	//取得參數
	var carid = para.data.carid;
	var title = para.data.title;
	var message = para.data.message;
	var rowdata = para.data.rowdata;

	//設定呼叫參數
	var URL = "ctpush/v1/postCPPushNotification";
	URL = String.format("%s/%s", URL, carid);

	var sendObj = {
		title : title,
		message : message,
		rowdata : rowdata
	};
	//呼叫web api warpper
	webapi.connect({
		data : {
			ip : Alloy.Globals.appEngineIP,
			url : URL,
			method : 'post',
			json : sendObj
		},
		success : para.success,
		fail : para.fail,
	});
};

//data(, success, fail)
exports.pcpnSend = function(para) {
	//檢查必要參數
	if (!para) {
		Ti.API.error('必要參數para 未提供!');
		return;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('必要參數para.data 未正確提供!');
		return;
	}
	if (!para.data.phoneid || !_.isString(para.data.phoneid)) {
		Ti.API.error('必要參數para.data.phoneid 未正確提供!');
		return;
	}
	if (!para.data.messageid || !_.isString(para.data.messageid)) {
		Ti.API.error('必要參數para.data.messageid 未正確提供!');
		return;
	}

	//取得參數
	var phoneid = para.data.phoneid;
	var messageid = para.data.messageid;

	//設定呼叫參數
	var URL = "ctpush/v1/postPCPushNotificationSend";
	URL = String.format("%s/%s/%s", URL, phoneid, messageid);

	var sendObj = {};
	//呼叫web api warpper
	webapi.connect({
		data : {
			ip : Alloy.Globals.appEngineIP,
			url : URL,
			method : 'post',
			json : sendObj
		},
		success : para.success,
		fail : para.fail,
	});
};

//data(, success, fail)
exports.cppnSend = function(para) {
	//檢查必要參數
	if (!para) {
		Ti.API.error('必要參數para 未提供!');
		return;
	}
	if (!para.data || !_.isObject(para.data)) {
		Ti.API.error('必要參數para.data 未正確提供!');
		return;
	}
	if (!para.data.carid || !_.isString(para.data.carid)) {
		Ti.API.error('必要參數para.data.carid 未正確提供!');
		return;
	}
	if (!para.data.messageid || !_.isString(para.data.messageid)) {
		Ti.API.error('必要參數para.data.messageid 未正確提供!');
		return;
	}

	//取得參數
	var carid = para.data.carid;
	var messageid = para.data.messageid;

	//設定呼叫參數
	var URL = "ctpush/v1/postCPPushNotificationSend";
	URL = String.format("%s/%s/%s", URL, carid, messageid);

	var sendObj = {};
	//呼叫web api warpper
	webapi.connect({
		data : {
			ip : Alloy.Globals.appEngineIP,
			url : URL,
			method : 'post',
			json : sendObj
		},
		success : para.success,
		fail : para.fail,
	});
};
