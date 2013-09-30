exports.definition = {
	config : {
		columns : {
			id : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			encodedKey : 'TEXT',
			deviceID : 'TEXT',
			appVersion : 'TEXT',
			senderID : 'TEXT',
			registerID : 'TEXT',
			addTime : 'TEXT',
			modTime : 'TEXT'
		},
		adapter : {
			type : 'sql',
			collection_name : 'mycars',
			idAttribute : 'id'
		}
	}
}; 