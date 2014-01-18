var args = arguments[0] || {};
$.settings_row.sec_id = args.sec_id || 'mysec_id';
$.settings_row.row_id = args.row_id || 'myrow_id';
$.settings_row.value_id = args.value_id || 'myvalue_id';
$.row_name.text = args.row_name || 'myname';
//$.row_value.text = args.row_value || 'myvalue';

$.row_value.text = Alloy.Globals.getValue(parseInt($.settings_row.sec_id), parseInt($.settings_row.row_id), parseInt($.settings_row.value_id));

// $.functionButton.visible = args.hideFunctionButton !== 'true';
// $.functionButton.title = args.functionTitle || '功能按鈕';
//
// function fireFunctionEvent(e) {
// $.trigger('rightFunction', e);
// }
//
// function doBack(e) {
// $.trigger('back', e);
// }