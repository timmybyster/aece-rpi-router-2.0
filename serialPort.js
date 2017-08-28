/* serialPort.js
created by : Tim Buckley
2017/08/04 */

var message = [];													//Initialise packet receive Buffer
var bufferIndex = 0;												//Initilaise Buffer Index
var packetRecieved = 0;												//Define a flag that can be set when a full packet has been received
var startHeader = 0;												//Define a flag that can be set when the start Header is received

var env = require('./environmentVariables');						//Get the environmentVariables
const serialPort = require('serialport');							//Get the Serial Port Module
const byteLength = serialPort.parsers.ByteLength;					//Define a constant Byte Length for the Serial Port
const port = new serialPort(env.SERIAL.PORT, {baudRate: env.SERIAL.BAUD_RATE});		//Define the serial Port to be opened with a set Baud Rate
const parser = port.pipe(new byteLength({length: 1}));				//Define an event trigger on every byte received

module.exports = {
	
	//initialises the Serial Port and the packet Received Check loop
	initialise : function (){
		parser.on('data', function (data){							//Event triggered as a byte has been received
			byte = parseInt(data[0]);								//Parse the Byte
			if(startHeader == 1){									//If the start Header has already been received
				message[bufferIndex] = byte;						//Write the received Byte to the buffer based on the current index
				if(bufferIndex == message[2] - 1){					//If the number of bytes recieved it equal to the packet length
					packetRecieved = 1;								//Set the packetRecieved Flag
					startHeader = 0;								//Clear the Start header Flag so new data can be received
				}
				bufferIndex++;										//Increment the buffer Index 
			}
			else if(byte == 0xAA){									//Otherwise if the byte is 0xAA
				message[bufferIndex] = 0xAA;						//write it to the buffer
				if(message[bufferIndex - 1] == 0xAA && message[bufferIndex] == 0xAA)	//And if the previous byte was also 0xAA
					startHeader = 1;								//Set the Start Header Flag
				bufferIndex++;										//Increment the Buffer Index
			}
			else
				bufferIndex = 0;									//If the startHeader Flag has not been set and the Byte is not 0xAA reset the buffer Index
		});
		
		setInterval(function(){										//Create a set Interval that is run forever
			if(packetRecieved == 1){								//if the Packet received Flag has been set
				console.log("packet Recieved");						//Log this on the Console
				packetRecieved = 0;									//Clear the Flag so it can be set again on a new reception
				var incomingPacketHandler = require('./incomingPacketHandler');//Get the Incoming packet Handler
				var updateHandler = require('./updateHandler');		//Get the update Handler
				incomingPacketHandler.handleIncomingPacket(message, function(err, updates){//pass the received packet to the handler
					if(err)											//if the function returns an error
						console.log("\x1b[31m", err);				//Log the error
					else{											//Otherwise No Error
						updateHandler.handleUpdates(updates, function(err, result){//Pass the updates to the Update Handler
							if(err)									//if there is an error
								console.log("\x1b[31m", err);		//Log the error
							else									//No Error
								console.log("\x1b[37m", result);	//Log any function result
						});
					}
						
				});
				message = [];										//clear the message buffer
				bufferIndex = 0;									//reset the buffer Index
			}
		},1);														//set the Interval to 1ms
	},
	
	
	//writes a Packet to the serial Port
	write : function(object, callback){
		port.write(object, function(err){							//Write the object to the port
			if(err)													//If there was an error
				callback(err, null);								//pass it to the callback
			else													//Otherwise
				callback(null, "packet Written to Port");			//Pass a success message to the callback
		});
	}
}