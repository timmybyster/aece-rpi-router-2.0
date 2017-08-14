/* jsonDb.js
created by : Tim Buckley
2017/08/07 */

var jsonDB = require('node-json-db');
db = new jsonDB('./treeTest',true, false);
tempDB = new jsonDB('./currentNode',true, false);

module.exports = {
	
	getAll : function (callback){
		db.reload();
		try{
			var tree = db.getData('/');
			callback(null, tree);
		}
		catch(err){
			callback(err, null);
		}
	},
	
	getRelevantTreeNode : function (type_id, serial, callback){
		db.reload();
		var path = '/ibc/';
		path += type_id + '/';
		path += serial;
		
		if(type_id == 'ibc')
			path = '/ibc';
		
		try{
			var treeNode = db.getData(path);
			tempDB.push('/', treeNode);
			callback(null, treeNode);
		}
		catch(err){
			console.log(err);
			callback('No Node Found', null);
		}
	},
	
	updateNode : function (path, update, callback){
		try{
			db.push(path, update, false);
			callback(null, "Updated JSON DB");
		}
		catch(err){
			callback(err, null);
		}
	},
	
	pushInsert : function (update, callback){
		var path = '/ibc/';
		switch(update.type_id){
			case 'ib651' :
				path += 'isc/';
				path += update.parent_serial + '/';
				break;
				
			case 'edd' :
				path += 'ab1/';
				path += update.parent_serial + '/';
				break;
				
			default :
				break;
		}
		path += update.type_id + '/';
		path += update.serial;
		
		if(update.type_id == 'ibc')
			path = '/ibc';
		
		try{
			db.push(path, update, false);
			callback(null, "Inserted JSON DB");
		}
		catch(err){
			callback(err, null);
		}
	}

}