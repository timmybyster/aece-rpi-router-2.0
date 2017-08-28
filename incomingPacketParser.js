/* incomingPacketParser.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	parseIncomingPacket : function (packet, callback){
		console.log("RAW MESSAGE: ");											//Log the Raw message on the console
		console.log(packet);
		var tempMessage = [];													//initalise a temporary array to compare CRCs
		for (j = 0; j < packet.length; j++){									//for the length of the message
			tempMessage[j] = packet[j];											//copy the message to the temporary array
		}
		var messageWithoutCrc = tempMessage.splice(0, tempMessage.length - 2);	//seperate the crc from the message
		var crc = require('./crc');												//get the Crc calculator
		var crcCalc = crc.calculate(messageWithoutCrc);							//Calculate the CRC based on the received message
		var parsedPacket = {													//create a parsed Packet object
			startByte : packet.splice(0,2),										//set the startByte
			packetLength : packet.splice(0,1),									//get the packet length
			command : packet.splice(0,1),										//get the command
			source : packet.splice(0,2),										//get the source
			data : null,														//initalise the data as null for now
			crc : null															//initalise the CRC as null for now
		}
		parsedPacket.data = packet.splice(0, parsedPacket.packetLength - 8);	//get the data based on the length of the packet
		parsedPacket.crc = packet.splice(0, 2);									//get the crc from the remaining bytes
		var cleanPacket = cleanIncomingPacket(parsedPacket);					//clean the packet
		if(crcCalc != cleanPacket.crc)											//if the crc calculated is not equal to the crc received
			callback("incorrect CRC, recieved: " + cleanPacket.crc.toString(16) + " expected: " + crcCalc.toString(16), null);//pass the error message to the callback
		else																	//otherwise
			callback(null, cleanPacket);										//pass the clean Packet to the callback
	}
}

function cleanIncomingPacket(parsedPacket){
	var cleanPacket = {															//define a clean packet object
		packetLength : parsedPacket.packetLength[0],							//convert the packet length from an array
		command : parsedPacket.command[0],										//convert the command from an array
		data : parsedPacket.data,												//keep the data as an array
		source : null,															//initalise the source as null for now
		crc : null																//initalise the crc as null for now
	}
	cleanPacket.source = (parsedPacket.source[0] << 8) & 0xFF00;				//get the source MSB
	cleanPacket.source |= parsedPacket.source[1];								//get the source LSB
	cleanPacket.crc = (parsedPacket.crc[0] << 8) & 0xFF00;						//get the crc MSB
	cleanPacket.crc |= parsedPacket.crc[1];										//get the crc LSB
	
	return cleanPacket;															//return the cleaned packet
}

