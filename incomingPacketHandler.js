/* incomingPacketHandler.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	handleIncomingPacket : function(message, callback){
		var incomingPacketParser = require('./incomingPacketParser');
		incomingPacketParser.parseIncomingPacket(message, function(err, packet){
			if(err)
				callback(err, null);
			else{
				console.log("\x1b[37m", "INCOMING PACKET: ");
				console.log("\x1b[37m", packet);
				var commandHandler;
				var node;
				switch(packet.command){
					case 1 :
						commandHandler = require('./ibcPingHandler');
						node = commandHandler.createNodeFromPacket(packet);
						break;
					case 2 :
						commandHandler = require('./iscPingHandler');
						node = commandHandler.createNodeFromPacket(packet);
						break;
					case 3 :
						commandHandler = require('./iscDataHandler');
						node = commandHandler.createNodeFromPacket(packet);
						break;
					case 4 :
						commandHandler = require('./ab1PingHandler');
						node = commandHandler.createNodeFromPacket(packet);
						break;
					case 5 :
						commandHandler = require('./ab1DataHandler');
						node = commandHandler.createNodeFromPacket(packet);
						break;
					case 8 :
						commandHandler = require('./ibcDataHandler');
						node = commandHandler.createNodeFromPacket(packet);
				}
				var updateBuilder = require('./updateBuilder');
				updateBuilder.buildUpdateFromTree(node, function (err, updates){
					if(err)
						callback(err, null);
					else
						callback(null, updates);
				});
			}
		});
	}
}