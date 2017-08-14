/* ab1PingHandler.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	createNodeFromPacket : function(packet){
		var ab1 = createAb1Object(packet.source);
		var eddLength = packet.data.length/5;
		var eddSerialArray, eddSerial, eddWindow;
		for (var i = 0; i < eddLength; i++){
			eddSerialArray = packet.data.splice(0,5);
			eddSerial = (eddSerialArray[0] << 24) & 0xFF000000;
			eddSerial |= (eddSerialArray[1] << 16) & 0xFF0000;
			eddSerial |= (eddSerialArray[2] << 8) & 0xFF00;
			eddSerial |= (eddSerialArray[3]) & 0xFF;
			ab1.children.push(createEddObject(eddSerial, eddSerialArray[4], packet.source));
		}
		return ab1;
	}
}

function createAb1Object(serial){
	var ab1Object = {
		serial : serial,
		type_id : "ab1",
		data : {communication_status : 1},
		children : []
	}
	return ab1Object; 
}

function createEddObject(serial, window, parentSerial){
	var eddObject = {
		serial : serial,
		type_id : "edd",
		data : {communication_status : 1, window_id : window},
		parent_serial : parentSerial
	}
	console.log(eddObject);
	return eddObject;
}