var args = arguments[0] || {};

var isDebug = args.isDebug || 'true';

function doEdit(e) {
	Ti.API.info('in settings_table, doEdit');
	// Ti.API.info('e = ' + JSON.stringify(e));
	for(var k in e){
		Ti.API.info('k = ' + k+",value= " +JSON.stringify(e[k]));
	}
	Ti.API.info('sec_id = ' + e.row.sec_id);
	Ti.API.info('row_id = ' + e.row.row_id);
	Ti.API.info('value_id = ' + e.row.value_id);
	Ti.API.info('e.row.children[1].text= ' + e.row.children[1].text);
	alert("尚未實作 doEdit");
}

function myback() {
	$.settings_table.close();
}

$.header.on('rightFunction', function(e) {
	isDebug && Ti.API.info('in settings_table, rightFunction');
});

$.header.on('back', myback);

$.settings_table.addEventListener('androidback', function() {
	myback();
});
