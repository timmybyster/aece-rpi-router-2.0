/* iscDataHandler.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	createNodeFromPacket : function(packet){
		var iscDataArray = packet.data.splice(0,2);
		var iscData = iscDataArray[1];
		var isc = createIscObject(packet.source, iscData);
		var ib651Length = (packet.data.length/2);
		var ib651SerialData, ib651Data;
		for (var i = 0; i < ib651Length; i++){
			ib651DataArray = packet.data.splice(0,2);
			ib651Data = ib651DataArray[1];
			ib651 = createIb651Object(ib651Data, i + 1, packet.source);
			isc.children.push(ib651); 
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

function createIscObject(serial, data){
	var iscObject = {
		serial : serial,
		type_id : "isc",
		data : createIscDataObject(data),
		children : []
	}
	return iscObject; 
}

function createIscDataObject(data){
	var iscDataObject = {
			communication_status : 1,
			key_switch_status: (data & 0b10000000) >> 7,
			blast_armed: (data & 0b00100000) >> 5,
			isolation_relay: (data & 0b01000000) >> 6,
			cable_fault: (data & 0b00010000) >> 4,
			earth_leakage: (data & 0b00001000) >> 3
	}
	return iscDataObject;
}

function createIb651Object(data, window, parentSerial){
	var ib651Object = {
		serial : window,
		type_id : "ib651",
		parent_serial : parentSerial,
		data : createIb651DataObject(data, window)
	}
	return ib651Object;
}

function createIb651DataObject(data, window){
	var ib651DataObject = {
			communication_status : 1,
			window_id : window,
			key_switch_status: (data & 0b01000000) >> 6,
			detonator_status: (data & 0b00100000) >> 5,
			partial_blast_lfs: (data & 0b00000100) >> 2,
			DC_supply_voltage: (data & 0b10000000) >> 7,
			booster_fired_lfs: (data & 0b00001000) >> 3,
			missing_pulse_detected_lfs: (data & 0b00000010) >> 1,
			mains: (data & 0b00010000) >> 4
	}
	return ib651DataObject;
}