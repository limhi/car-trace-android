var args = arguments[0] || {};

var isDebug = args.isDebug || 'true';

var dbmatch = require('common_db_match');
dbmatch.enableDebug();
var mymatches = Alloy.Collections.mymatches;

if ($.rowTVR.selected === 'Y') {
	$.selectL.text = 'enable';
} else {
	$.selectL.text = 'disable';
}

function myClick(e) {
	isDebug && Ti.API.info('in index_row, in myClick, e = ' + JSON.stringify(e));
	if (e.source.text) {
		if (e.source.text === 'Delete') {
			isDebug && Ti.API.info('in index_row, in myClick, do Delete');
			dbmatch.removeItem(mymatches, e.index);
		} else if (e.source.text === 'enable' || e.source.text === 'disable') {
			isDebug && Ti.API.info('in index_row, in myClick, try to make enable/disable');
			myChange(e.index);
		} else {
			//try to rename
			isDebug && Ti.API.info('in index_row, in myClick, try to rename');
			var mymatch = mymatches.at(e.index);
			// Ti.API.info('mymatch = ' + JSON.stringify(mymatch));
			var input_text = Ti.UI.createTextField();
			input_text.value = mymatch.get('showname');

			var dialog = Ti.UI.createOptionDialog({
				androidView : input_text,
				buttonNames : ['OK', 'Cancel']
			});

			dialog.addEventListener('click', function(ee) {
				if (ee.index === 0) {// we read it only if get it is pressed
					//alert(input_text.value);
					mymatch.set('showname', input_text.value);
					mymatch.save();
					//updateUI();
				}
			});
			dialog.show();
		}
	} else {
		//try to make enable/disable
		isDebug && Ti.API.info('in index_row, in myClick, try to make enable/disable 2');
		myChange(e.index);
	}
}

function myChange(index) {
	isDebug && Ti.API.info('in index_row, in myChange, index = ' + index);
	var mymatch = mymatches.at(index);
	if (mymatch.get('selected') != 'Y') {
		mymatches.each(function(model) {
			isDebug && Ti.API.info('in index_row, in myChange, model = ' + JSON.stringify(model));
			model.set('selected', 'N');
			model.save();
		});
		mymatch.set('selected', 'Y');
		mymatch.save();
	}
}
