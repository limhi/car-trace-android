var args = arguments[0] || {};
// $.headerTitle.text = args.title || '';
// $.functionButton.visible = args.hideFunctionButton !== 'true';
// $.functionButton.title = args.functionTitle || '功能按鈕';tion fireFunctionEvent(e) {
//	$.trigger('rightFunction', e);
//}

// function doBack(e) {
// $.trigger('back', e);
// }

var cacheImage = require("cacheImage");

function transformData(model) {
	var attrs = model.toJSON();
	Ti.API.info('in main->transformData, model = ' + JSON.stringify(model));
	var picture = model.get("picture");
	Ti.API.info('in main->transformData, picture = ' + picture);

	// cacheImage.loadImage(picture, {
		// remoteCheck : null,
		// checkInterval : null
	// }, function(response) {
		// Ti.API.info('in main->transformData->loadImage');
		// if (response) {
			// if (response.success) {
				// Ti.API.info('in main->transformData->loadImage,success file = ' + response.file);
				// attrs.picture = response.file;
			// } else {
				// Ti.API.error('in main->transformData->loadImage,fail error = ' + response.error);
			// }
		// }
	// });

	// attrs.imageUrl = '/' + attrs.direction + '.png';
	// attrs.upperCaseName = attrs.name.toUpperCase();
	return attrs;
}

function doSendTo(e) {
	Ti.API.info('in index, doSendTo');
	alert("尚未實作 doSendTo");
}

function doSnapshot(e) {
	Ti.API.info('in index, doSnapshot');
	alert("尚未實作 doSnapshot");
}

function doTalk(e) {
	Ti.API.info('in index, doTalk');
	alert("尚未實作 doTalk");
}

function doEnableGPS(e) {
	Ti.API.info('in index, doEnableGPS');
	alert("尚未實作 doEnableGPS");
}

updateUI();
