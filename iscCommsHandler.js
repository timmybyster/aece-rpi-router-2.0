/* iscCommsHandler.js
created by : Tim Buckley
2017/08/04 */

var context;

module.exports = {
	
	initialise : function (){
		var env = require('./environmentVariables');
		createContext();
		setInterval(iscCommunication, env.ISC_COMMS.INTERVAL);
	},
	
	checkResponse : function(isc, callback){
		var json = require('./jsonHandler.js');
		json.readContext(function(err, context){
			if(err)
				callback(err, null);
			else{
				if(isc.serial == context.serial){
					context.communicationResponse = 1;
					json.writeContext(context, function(err){
						if(err)
							console.log(err);
					});
				}
			}
		});
	}
}

function iscCommunication(){
	var json = require('./jsonHandler');
	var env = require('./environmentVariables');
	var serial = require('./serialPort');
	json.readTree(function(err, tree){
		if(err)
			console.log(err);
		else{
			var iscs = [];
			tree.children.forEach(child =>{
				if(child.type_id == 1)
					iscs.push(child);
			});
			json.readContext(function(err, context){
				context.retry++;
				if(context.communicationResponse || context.retry >= env.ISC_COMMS.RETRIES){
					if(context.retry >= env.ISC_COMMS.RETRIES){
						console.log("\x1b[31m", "ISC SN: " + iscs[context.index].serial + " communication loss");
						updateIscCommunicationStatus(iscs[context.index]);
					}	
					if(context.command == 2 && context.communicationResponse)
						context.command = 3;
					else{
						context.index ++;
						context.command = 2;
					}
					context.retry = 0;
					context.communicationResponse = 0;
					
					if(context.index >= iscs.length)
						context.index = 0;
				}
				else{
					context.serial = iscs[context.index].serial;
					serial.write(buildOutgoingPacket(context.command, iscs[context.index].serial), function(err, result){
						if(err)
							console.log(err);
						else
							console.log("\x1b[37m", result);
					});	
				}
				json.writeContext(context, function(err){
					if(err)
						console.log(err);
				});
			});
		}
	});		
}

function buildOutgoingPacket(command, destination){
	var outgoingPacket = [];
	outgoingPacket.push(0xAA);
	outgoingPacket.push(0xAA);
	outgoingPacket.push(command);
	outgoingPacket.push((destination >> 8) & 0xFF);
	outgoingPacket.push(destination & 0xFF);
	var crc = require('./crc');
	var crcCalc = crc.calculate(outgoingPacket);
	outgoingPacket.push((crcCalc >> 8) & 0xFF);
	outgoingPacket.push(crcCalc & 0xFF);
	console.log("\x1b[37m", outgoingPacket);
	return outgoingPacket;
}

function createContext(){
	var json = require('./jsonHandler.js');
	var contextObject;
	json.readContext(function(err, context){
		if(err || context == null){
			contextObject = {
				command : 2,
				index : 0,
				retry : 0,
				communicationResponse : 0,
				serial : null
			};
		}
		else
			contextObject = context;
		json.writeContext(contextObject, function(err){
			if(err)
				console.log(err);
		});
	});
}

function updateIscCommunicationStatus(isc){
	var updateHandler = require('./updateHandler.js');
	if(!isc.data.communication_status)
		return;
	var updates = {updates : [{
						serial : isc.serial,
						type_id : 1,
						data: {communication_status : 0}
						}],
					inserts : []
					};
	updateHandler.handleUpdates(updates, function(err, result){
		if(err)
			console.log(err);
		else
			console.log(result)
	});
}