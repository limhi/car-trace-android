exports.definition = {
	config : {
		columns : {
			id : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			encodedKey : 'TEXT',
			carID : "TEXT",
			phoneID : "TEXT",
			messageType : "TEXT",
			mySerial:"TEXT",
			gps : "TEXT",
			blobKey : "TEXT",
			picture : "TEXT",
			settings : "TEXT",
			addTime : "TEXT",
			modTime : "TEXT"
		},
		adapter : {
			type : 'sql',
			collection_name : 'mymessages',
			idAttribute : 'id'
		}
	}
};
