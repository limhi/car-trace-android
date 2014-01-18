var args = arguments[0] || {};

var isDebug = args.isDebug || 'true';

function doDownloadSettings(e) {
	Ti.API.info('in index_table, doDownloadSettings');
	alert("尚未實作 doDownloadSettings");
}

function doEditSettings(e) {	
	isDebug && Ti.API.info('in index_table, doEditSettings');
	var settingsEditController = Alloy.createController('settings/settings_table', {
		isDebug : true
	});
	settingsEditController && settingsEditController.getView() && settingsEditController.getView().open();
	//alert("尚未實作 doEditSettings");
}

function doUploadSettings(e) {
	Ti.API.info('in index_table, doUploadSettings');
	alert("尚未實作 doUploadSettings");
}

function myback() {
	$.index_table.close();
}

$.header.on('rightFunction', function(e) {
	isDebug && Ti.API.info('in index_table, rightFunction');
});

$.header.on('back', myback);

$.index_table.addEventListener('androidback', function() {
	myback();
});
