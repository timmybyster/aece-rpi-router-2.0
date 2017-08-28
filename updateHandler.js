/* updateHandler.js
created by : Tim Buckley
2017/07/28 */

module.exports = {
	handleUpdates : function (updates, callback){
		updates.updates.forEach (update => {								//for Each update
			filterAndExecuteUpdates(update, function (err, result){			//execute the update
				if(err)														//if there was an error
					callback(err, null);									//pass it to the callback
				else														//otherwise
					callback(null, result);									//pass the result to the callback
			});
		});
		
		updates.jsonUpdates.forEach(jsonUpdate => {							//for each JSON update
			updateJsonObject(jsonUpdate, function(err, result){				//update the JSON object
				if(err)														//if there was an error
					callback(err, null);									//pass it to the callback
				else														//otherwise
					callback(null, result);									//pass the result to the callback
			});
		});
		
		updates.inserts.forEach (insert => {								//for each insert
			filterAndExecuteInserts(insert, function (err, result){			//execute the insert
				if(err)														//if there was an error
					callback(err, null);									//pass it to the callback
				else														//otherwise
					callback(null, result);									//pass the result to the callback
			});
		});
	}
}

function filterAndExecuteUpdates(update, callback){
	console.log("\x1b[32m", "###UPDATE");										//log that an UPDATE is being performed
	var updateCheck = 0;														//set the update Check flag to 0
	for (var property in update.data){											//if there has been a change to data
		updateCheck++;															//increment the flag
	}
	if(updateCheck > 0){														//if the flag has been set
		var pubnub = require('./pubnub');										//get the pubnub Handler
		var tcpServer = require('./tcpServer');									//get the TCP handler
		var mysql = require('./mysql');											//get the MYSQL handler
		
		console.log("\x1b[33m", "1. PUBLISHING PUBNUB UPDATE......");			//log that the PUBNUB update is being performed
		pubnub.publish(update, 'updateChannel', function (err, result){			//publish the message
			if(err)																//if there is an error
				callback(err, null)												//pass it to the callback
			else																//otherwise
				callback(null, "PUBNUB update Published");						//pass a success message to the callback
		});
		
		console.log("\x1b[35m", "2. WRITING UPDATE TO TCP CLIENT......");		//log that the TCP update is being performed
		tcpServer.write(update, function(err, result){							//write to the TCP client
			if(err)																//if there was an error
				callback(err, null);											//pass the error to the callback
			else																//otherwise
				callback(null, result);											//pass the result to the callback 
		});
		
		console.log("\x1b[35m", "3. UPDATING MYSQL......");						//log that the MYSQL update is bieng performed
		mysql.updateNodeData(update, function(err, result){						//update the MYSQL DB
			if(err)																//if there was an error
				callback(err, null);											//pass the error to the callback
			else																//otherwise
				callback(null, result);											//pass the result to the callback
		});
		
	}
	else																		//nothing has changed
		callback(null, "Nothing to update");									//pass this to the callback
}

function filterAndExecuteInserts(insert, callback){
	console.log("\x1b[32m", "###INSERT");										//Log that we are performing an insert
	var pubnub = require('./pubnub');											//get the pubnub handler
	var jsonDB = require('./jsonDb');											//get the JSON DB handler
	var tcpServer = require('./tcpServer');										//get the TCP handler
	var mysql = require('./mysql');												//get the MYSQL handler
	
	console.log("\x1b[33m", "1. PUBLISHING PUBNUB INSERT......");				//log the pubnub insert
	pubnub.publish(insert, 'updateChannel', function (err, result){				//publish the insert to pubnub
		if(err)																	//if there is an error
			callback(err, null)													//pass it to the callback
		else																	//otherwise
			callback(null, "PUBNUB update Published");							//pass a success message to the callback
	});
	
	console.log("\x1b[34m", "2. INSERTING JSON......");							//log the JSON insert
	jsonDB.pushInsert(insert, function(err, result){							//pass the insert to the JSON DB handler
		if(err)																	//if there was an error
			callback(err, null);												//pass the error to the callback
		else																	//otherwise
			callback(null, result);												//pass the result to the callback
	});
	
	console.log("\x1b[35m", "2. WRITING INSERT TO TCP CLIENT......");			//log the TCP insert
	tcpServer.write(insert, function(err, result){								//write the insert to the TCP server handler
		if(err)																	//if there was an error
			callback(err, null);												//pass the error to the callback
		else																	//otherwise
			callback(null, result);												//pass the result to the callback
	});
	
	console.log("\x1b[35m", "3. INSERTING MYSQL......");						//log the mysql insert
		mysql.insertNodeData(insert, function(err, result){						//pass the insert to the mysql handler
		if(err)																	//if there was an error
			callback(err, null);												//pass the error to the callback
		else																	//otherwise
			callback(null, result);												//pass the result to the callback
	});
}

function updateJsonObject(update, callback){
	console.log("\x1b[33m", "2. UPDATING JSON......");							//log that we are performing a JSON update
	var jsonDB = require('./jsonDb');											//get the JSON DB handler
	var path = '/ibc/'															//initialise the path
	path += update.type_id + '/';												//add the type ID to the path
	path += update.serial;														//add the serial number to the path
	
	if(update.type_id == 'ibc')													//if the update is an ibc
		path = '/ibc';															//re-initialise the path
	
	jsonDB.updateNode(path, update, function(err, result){						//update the node in the JSON DB
		if(err)																	//if there was an error
			callback(err, null);												//pass the error to the callback
		else																	//otherwise
			callback(null, result);												//pass the result to the callback
	});
}