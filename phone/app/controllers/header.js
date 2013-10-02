var args = arguments[0] || {};
$.headerTitle.text = args.title || '';
$.functionButton.visible = args.hideFunctionButton !== 'true';
$.functionButton.title = args.functionTitle || '功能按鈕';

function fireFunctionEvent(e) {
	$.trigger('rightFunction', e);
}

function doBack(e) {
	$.trigger('back', e);
}