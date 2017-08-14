/* serialPort.js
created by : Tim Buckley
2017/08/04 */

var message = [];
var bufferIndex = 0;
var packetRecieved = 0;
var startHeader = 0;

var env = require('./environmentVariables');
const serialPort = require('serialport');
const byteLength = serialPort.parsers.ByteLength;
const port = new serialPort(env.SERIAL.PORT, {baudRate: 9600});
const parser = port.pipe(new byteLength({length: 1}));

module.exports = {
	initialise : function (){
		parser.on('data', function (data){
			byte = parseInt(data[0]);
			console.log(byte);
			if(startHeader == 1){
				message[bufferIndex] = byte;
				console.log(message);
				if(bufferIndex == message[2] - 1){
					packetRecieved = 1;
					startHeader = 0;
				}
				bufferIndex++;
			}
			else if(byte == 0xAA){
				message[bufferIndex] = 0xAA;
				if(message[bufferIndex - 1] == 0xAA && message[bufferIndex] == 0xAA)
					startHeader = 1;
				bufferIndex++;
			}
		});
		
		setInterval(function(){
			if(packetRecieved == 1){
				console.log("packet Recieved");
				packetRecieved = 0;
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
				message = [];
				bufferIndex = 0;
			}
		},1);
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