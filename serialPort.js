/* serialPort.js
created by : Tim Buckley
2017/08/04 */

var serialPort = require('serialport');

var env = require('./environmentVariables');
var port = new serialPort(env.SERIAL.PORT);

module.exports = {
	initialise : function (){
		port.on('readable', function (){
			var message = port.read();
			var incomingPacketHandler = require('./incomingPacketHandler');
			var updateHandler = require('./updateHandler');
			incomingPacketHandler.handleIncomingPacket(message, function(err, updates){
				if(err)
					console.log("\x1b[31m", err);
				else{
					updateHandler.handleUpdates(updates, function(err, result){
						if(err)
							console.log("\x1b[31m", err);
						else
							console.log("\x1b[37m", result);
					});
				}
					
			});
			
		});
	},
	
	write : function(object, callback){
		port.write(object, function(err){
			if(err)
				callback(err, null);
			else
				callback(null, "packet Written to Port");
		});
	}
}