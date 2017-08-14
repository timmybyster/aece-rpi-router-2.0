/* updateHandler.js
created by : Tim Buckley
2017/07/28 */

module.exports = {
	handleUpdates : function (updates, callback){
		updates.updates.forEach (update => {
			filterAndExecuteUpdates(update, function (err, result){
				if(err)
					callback(err, null);
				else
					callback(null, result);
			});
		});
		
		updates.jsonUpdates.forEach(jsonUpdate => {
			updateJsonObject(jsonUpdate, function(err, result){
				if(err)
					callback(err, null);
				else
					callback(null, result);
			})
		});
		
		updates.inserts.forEach (insert => {
			filterAndExecuteInserts(insert, function (err, result){
				if(err)
					callback(err, null);
				else
					callback(null, result);
			});
		});
	}
}

function filterAndExecuteUpdates(update, callback){
	console.log("\x1b[32m", "###UPDATE");
	var updateCheck = 0;
	for (var property in update.data){
		updateCheck++;
	}
	if(updateCheck > 0){
		var pubnub = require('./pubnub');
		var tcpServer = require('./tcpServer');
		var mysql = require('./mysql');
		
		console.log("\x1b[33m", "1. PUBLISHING PUBNUB UPDATE......");
		pubnub.publish(update, 'updateChannel', function (err, result){
			if(err)
				callback(err, null)
			else
				callback(null, "PUBNUB update Published");
		});
		
		console.log("\x1b[35m", "2. WRITING UPDATE TO TCP CLIENT......");
		tcpServer.write(update, function(err, result){
			if(err)
				callback(err, null);
			else
				callback(null, result);
		});
		
		console.log("\x1b[35m", "3. UPDATING MYSQL......");
		mysql.updateNodeData(update, function(err, result){
			if(err)
				callback(err, null);
			else
				callback(null, result);
		});
		
	}
	else
		callback(null, "Nothing to update");
}

function filterAndExecuteInserts(insert, callback){
	console.log("\x1b[32m", "###INSERT");
	var pubnub = require('./pubnub');
	var jsonDB = require('./jsonDb');
	var tcpServer = require('./tcpServer');
	
	console.log("\x1b[33m", "1. PUBLISHING PUBNUB INSERT......");
	pubnub.publish(insert, 'updateChannel', function (err, result){
			if(err)
				callback(err, null);
			else
				callback(null, "PUBNUB insert Published......");
    });
	
	console.log("\x1b[34m", "2. INSERTING JSON......");
	jsonDB.pushInsert(insert, function(err, result){
		if(err)
			callback(err, null);
		else
			callback(null, result);
	});
	
	console.log("\x1b[35m", "2. WRITING INSERT TO TCP CLIENT......");
	tcpServer.write(update, function(err, result){
		if(err)
			callback(err, null);
		else
			callback(null, result);
	});
}

function updateJsonObject(update, callback){
	console.log("\x1b[33m", "2. UPDATING JSON......");
	var jsonDB = require('./jsonDb');
	var path = '/ibc/'
	path += update.type_id + '/';
	path += update.serial;
	
	if(update.type_id == 'ibc')
		path = '/ibc';
	
	jsonDB.updateNode(path, update, function(err, result){
		if(err)
			callback(err, null);
		else
			callback(null, result);
	})
	
}