/* ibcPingHandler.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	createNodeFromPacket : function(packet){
		var ibc = createIbcObject(packet.source);
		var iscLength = packet.data.length/2;
		var iscSerialArray, iscSerial;
		for (var i = 0; i < iscLength; i++){
			iscSerialArray = packet.data.splice(0,2);
			iscSerial = (iscSerialArray[0] << 8) & 0xFF00;
			iscSerial |= iscSerialArray[1];
			ibc.children.push(createIscObject(iscSerial, packet.source));
		}
		return ibc;
	}
}

function createIbcObject(serial){
	var ibcObject = {
		serial : serial,
		type_id : 'ibc',
		children : [],
		data : {communication_status : 1}
	}
	return ibcObject; 
}

function createIscObject(serial, parentSerial){
	var iscObject = {
		serial : serial,
		type_id : 'isc',
		parent_serial : parentSerial,
		data : {communication_status : 1}
	}
	return iscObject;
}