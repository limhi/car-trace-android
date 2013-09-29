//var args = arguments[0] || {};
var Alloy = require('alloy');
var webapi = require('common_webapi');
webapi.enableDebug();
var isDebug = false;
exports.enableDebug = function() {
	isDebug = true;
};

exports.disableDebug = function() {
	isDebug = false;
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


