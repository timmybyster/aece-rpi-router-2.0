/* iscPingHandler.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	createNodeFromPacket : function(packet){
		var isc = createIscObject(packet.source);
		var ib651Length = packet.data.length/2;
		var ib651SerialArray, ib651Serial;
		for (var i = 0; i < ib651Length; i++){
			ib651SerialArray = packet.data.splice(0,2);
			ib651Serial = (ib651SerialArray[1] << 8) & 0xFF00;
			ib651Serial |= ib651SerialArray[0];
			isc.children.push(createIb651Object(ib651Serial, i + 1, packet.source));
		}
		//var iscComms = require('./iscCommsHandler.js');
		//iscComms.checkResponse(isc, function(err, result){
		//	if(err)
		//		callback(err, null);
		//	else
		//		callback(null, result);
		//});
		return isc;
	}
}

function createIscObject(serial){
	var iscObject = {
		serial : serial,
		type_id : "isc",
		data :{communication_status : 1},
		children : [],
	}
	return iscObject; 
}

function createIb651Object(serial, window, parentSerial){
	var ib651Object = {
		serial : window,
		type_id : "ib651",
		parent_serial : parentSerial,
		data : {serial : serial, window_id : window, communication_status : 1}
	}
	return ib651Object;
}