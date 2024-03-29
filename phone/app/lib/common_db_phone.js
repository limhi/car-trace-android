//var args = arguments[0] || {};
var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var isDebug = false;
exports.enableDebug = function() {
	isDebug = true;
};

exports.disableDebug = function() {
	isDebug = false;
};

exports.addItem = function(collection, para) {
	try {
		collection.fetch();
		isDebug && Ti.API.info('addItem in common_db_phone, para=' + JSON.stringify(para));
		isDebug && Ti.API.info('addItem in common_db_phone, collection.length=' + collection.length);
		// create a new model instance based on user input
		var entry = Alloy.createModel('myphones', {
			encodedKey : para.encodedKey,
			deviceID : para.deviceID,
			appVersion : para.appVersion,
			senderID : para.senderID,
			registerID : para.registerID,
			addTime : para.addTime,
			modTime : para.modTime
		});

		// Add new model to the collection, use silent=true
		// so that a "change" event is not fired and the
		// UI is re-rendered.
		// add new model to local collection
		collection.add(entry, {
			silent : true
		});

		// Save the entry to persistence, which will re-render
		// the UI based on the binding.
		entry.save();
		isDebug && Ti.API.info('addItem in common_db_phone, after add, entry=' + JSON.stringify(entry));
		isDebug && Ti.API.info('addItem in common_db_phone, after add, collection.length=' + collection.length);

		// reload the collection from persistent storage
		collection.fetch();
	} catch(error) {
		Ti.API.error('addItem in common_db_phone, error=' + error);
	}

};

exports.setOnlyItem = function(collection, para) {
	try {
		collection.fetch();
		isDebug && Ti.API.info('setOnlyItem in common_db_phone, para=' + JSON.stringify(para));
		isDebug && Ti.API.info('setOnlyItem in common_db_phone, collection.length=' + collection.length);

		//clean all record in collection
		while (collection.length > 0) {
			collection.pop().destroy();
		}

		isDebug && Ti.API.info('setOnlyItem in common_db_phone, after reset, collection.length=' + collection.length);

		// create a new model instance based on user input
		var entry = Alloy.createModel('myphones', {
			encodedKey : para.encodedKey,
			deviceID : para.deviceID,
			appVersion : para.appVersion,
			senderID : para.senderID,
			registerID : para.registerID,
			addTime : para.addTime,
			modTime : para.modTime
		});

		// Add new model to the collection, use silent=true
		// so that a "change" event is not fired and the
		// UI is re-rendered.
		// add new model to local collection
		collection.add(entry, {
			silent : true
		});

		// Save the entry to persistence, which will re-render
		// the UI based on the binding.
		entry.save();

		isDebug && Ti.API.info('setOnlyItem in common_db_phone, after save, entry=' + JSON.stringify(entry));
		isDebug && Ti.API.info('setOnlyItem in common_db_phone, after save, collection.length=' + collection.length);

		// reload the collection from persistent storage
		collection.fetch();
	} catch(error) {
		Ti.API.error('setOnlyItem in common_db_phone, error=' + error);
	}
};

exports.removeItem = function(collection, index) {
	var model = collection.at(index);

	// remove the model from the collection
	collection.remove(model);

	// destroy the model from persistence
	model.destroy();

	// update views from sql storage
	//TODO:當改成用sql儲存時，要啟用下行
	collection.fetch();

};

exports.removeAll = function(collection) {
	collection.fetch();
	isDebug && Ti.API.info('removeAll in common_db_phone, collection.length=' + collection.length);

	//clean all record in collection
	while (collection.length > 0) {
		collection.pop().destroy();
	}

	isDebug && Ti.API.info('removeAll in common_db_phone, after reset, collection.length=' + collection.length);
};

exports.comparator = function(model) {
	return model.get('modTime');
};
