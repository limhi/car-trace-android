migration.up = function(migrator) {
	migrator.createTable({
		"columns" : {
			id : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			encodedKey : 'TEXT',
			carID : "TEXT",
			phoneID : "TEXT",
			messageType : "TEXT",
			gps : "TEXT",
			picture : "TEXT",
			settings : "TEXT",
			addTime : "TEXT",
			modTime : "TEXT"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("mymessages");
};
