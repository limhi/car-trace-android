exports.definition = {
	config : {
		columns : {
			id : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			encodedKey : 'TEXT',
			carID : "TEXT",
			phoneID : "TEXT",
			selected : "TEXT",
			showname : "TEXT",
			addTime : "TEXT",
			modTime : "TEXT"
		},
		adapter : {
			type : 'sql',
			collection_name : 'mymatches',
			idAttribute : 'id'
		}
	}
};
