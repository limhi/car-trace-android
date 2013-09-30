migration.up = function(migrator) {
	migrator.createTable({
		"columns" : {
			id : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			encodedKey : 'TEXT',
			deviceID : 'TEXT',
			appVersion : 'TEXT',
			senderID : 'TEXT',
			registerID : 'TEXT',
			addTime : 'TEXT',
			modTime : 'TEXT'
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("mycars");
};
