/* incomingPacketHandler.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	handleIncomingPacket : function(message, callback){
		var incomingPacketParser = require('./incomingPacketParser');				//get the Incoming packet parser 
		incomingPacketParser.parseIncomingPacket(message, function(err, packet){	//parse the Incoming packet
			if(err)																	//if there is an error
				callback(err, null);												//pass it to the callback
			else{																	//otherwise
				console.log("\x1b[37m", "INCOMING PACKET: ");						//Log that there is an incoming packet
				console.log("\x1b[37m", packet);
				var commandHandler;													//define a temporary variable for the command handler
				var node;															//define a temporary variable fot the node
				switch(packet.command){												//switch statement based on the command receieved
					case 1 :														//IBC ping
						commandHandler = require('./ibcPingHandler');				//get the IBC ping command Handler			
						node = commandHandler.createNodeFromPacket(packet);			//build the node based on the IBC command
						break;														//break the switch statement
					case 2 :														//ISC Ping
						commandHandler = require('./iscPingHandler');				//get the ISC ping command Handler	
						node = commandHandler.createNodeFromPacket(packet);			//build the node based on the ISC command
						break;														//break the switch statement
					case 3 :														//ISC Data
						commandHandler = require('./iscDataHandler');				//get the ISC Data command Handler
						node = commandHandler.createNodeFromPacket(packet);			//build the node based on the ISC command
						break;														//break the switch statement
					case 4 :														//AB1 ping
						commandHandler = require('./ab1PingHandler');				//get the AB1 ping command Handler
						node = commandHandler.createNodeFromPacket(packet);			//build the node based on the AB1 command
						break;														//break the switch statement
					case 5 :														//AB1 Data
						commandHandler = require('./ab1DataHandler');				//get the AB1 ping command Handler
						node = commandHandler.createNodeFromPacket(packet);			//build the node based on the AB1 command
						break;														//break the switch statement
					case 8 :														//IBC Data
						commandHandler = require('./ibcDataHandler');				//get the IBC ping command Handler
						node = commandHandler.createNodeFromPacket(packet);			//build the node based on the IBC command
						break;														//break the switch statement
				}
				var updateBuilder = require('./updateBuilder');						//get the update Builder
				updateBuilder.buildUpdateFromTree(node, function (err, updates){	//pass the Node to the update Builder
					if(err)															//if there is an error 
						callback(err, null);										//pass it to the callback
					else															//otherwise
						callback(null, updates);									//pass the updates to the callback
				});
			}
		});
	}
}