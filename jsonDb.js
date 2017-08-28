/* jsonDb.js
created by : Tim Buckley
2017/08/07 */

var jsonDB = require('node-json-db');
var env = require('./environmentVariables')
db = new jsonDB(env.JOSN_DB.FILE, true, false);
tempDB = new jsonDB('./currentNode',true, false);

module.exports = {
	
	getAll : function (callback){
		db.reload();											//reload the DB from the File in case external changes were made
		try{													//try to access the DB
			var tree = db.getData('/');							//get the entire DB
			callback(null, tree);								//pass the tree to the callback
		}
		catch(err){												//if there is an error reading the DB
			callback(err, null);								//pass the error to the callback
		}
	},
	
	getRelevantTreeNode : function (type_id, serial, callback){
		db.reload();											//reload the DB from the File in case external changes were made
		var path = '/ibc/';										//initialise the path
		path += type_id + '/';									//add the type ID to the path
		path += serial;											//add the serial number to the path
		
		if(type_id == 'ibc')									//if the node is an IBC
			path = '/ibc';										//revert the path to just '/ibc'
		try{													//try getting the specified path data
			var treeNode = db.getData(path);					//get the data
			tempDB.push('/', treeNode);							//push the current tree node to a temporary DB
			callback(null, treeNode);							//pass the tree Node to the callback
		}
		catch(err){												//if there was an error
			callback('No Node Found', null);					//pass it to the callback
		}
	},
	
	updateNode : function (path, update, callback){
		try{													//try updating the path specified
			db.push(path, update, false);						//push the update to the DB
			callback(null, "Updated JSON DB");					//Pass a message to the callback
		}
		catch(err){												//if there was an error
			callback(err, null);								//pass the error to the callback
		}
	},
	
	pushInsert : function (update, callback){	
		var path = '/ibc/';										//initialise the path
		switch(update.type_id){									//switch statement dependint on the type ID
			case 'ib651' :										//type is ib651
				path += 'isc/';									//parent is isc so add to path
				path += update.parent_serial + '/';				//add the parent serial to the path as well
				break;											//break the swtich statement
				
			case 'edd' :										//type is edd
				path += 'ab1/';									//parent is ab1 so add it to the path
				path += update.parent_serial + '/';				//add the parent serial to the path as well
				break;											//break the swtich statement
				
			default :											//if the type is anything else keep the path as is
				break;
		}
		path += update.type_id + '/';							//add the type id to the path
		path += update.serial;									//add the serial of the update to the path
		
		if(update.type_id == 'ibc')								//if the type is an ibc
			path = '/ibc';										//re-initialise the path
		
		try{													//try updating with the updating
			db.push(path, update, false);						//push the update to the db
			callback(null, "Inserted JSON DB");					//pass the message to the callback
		}
		catch(err){												//if there was an error
			callback(err, null);								//pass the error to the callback
		}
	}

}