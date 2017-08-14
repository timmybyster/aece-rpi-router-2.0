/* incomingPacketParser.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	parseIncomingPacket : function (message, callback){
		var packet = [];
		var tempMessage = [];
		for (j = 0; j < parseInt(message[2]); j ++){
			packet[j] = parseInt(message[j]);
			tempMessage[j] = parseInt(message[j]);
		}
		var messageWithoutCrc = tempMessage.splice(0, tempMessage.length - 2);
		var crc = require('./crc');
		var crcCalc = crc.calculate(messageWithoutCrc);
		var parsedPacket = {
			startByte : packet.splice(0,2),
			packetLength : packet.splice(0,1),
			command : packet.splice(0,1),
			source : packet.splice(0,2),
			data : null,
			crc : null
		}
		parsedPacket.data = packet.splice(0, parsedPacket.packetLength - 8);
		parsedPacket.crc = packet.splice(0, 2);
		var cleanPacket = cleanIncomingPacket(parsedPacket);
		if(crcCalc != cleanPacket.crc)
			callback("incorrect CRC, recieved: " + cleanPacket.crc.toString(16) + " expected: " + crcCalc.toString(16), null);
		else
			callback(null, cleanPacket);
	}
}

function cleanIncomingPacket(parsedPacket){
	var cleanPacket = {
		packetLength : parsedPacket.packetLength[0],
		command : parsedPacket.command[0],
		data : parsedPacket.data,
		source : null,
		crc : null
	}
	cleanPacket.source = (parsedPacket.source[0] << 8) & 0xFF00;
	cleanPacket.source |= parsedPacket.source[1];
	cleanPacket.crc = (parsedPacket.crc[0] << 8) & 0xFF00;
	cleanPacket.crc |= parsedPacket.crc[1];
	
	return cleanPacket;
}

