/* ab1DataHandler.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	createNodeFromPacket : function(packet){
		var ab1DataArray = packet.data.splice(0,4);
		var ab1Window = ab1DataArray[0];
		var ab1Crc = ab1DataArray[1];
		var ab1Data = ab1DataArray[2] << 8;
		ab1Data |= ab1DataArray[3];
		var ab1 = createAb1Object(packet.source, ab1Data, ab1Window);
		var eddLength = (packet.data.length/4);
		var eddDataArray, eddData, eddWindow, eddDelay;
		for (var i = 0; i < eddLength; i++){
			eddDataArray = packet.data.splice(0,4);
			eddWindow = eddDataArray[0];
			eddData = eddDataArray[1];
			eddDelay = eddDataArray[2];
			eddDelay |= eddDataArray[3];
			edd = createEddObject(eddData, i + 1, eddDelay, packet.source);
			ab1.children.push(edd); 
		}
		return ab1;
	}
}

function createAb1Object(serial, data , window){
	var ab1Object = {
		serial : serial,
		type_id : "ab1",
		data : createAb1DataObject(data, window),
		children : []
	}
	return ab1Object; 
}
	
function createAb1DataObject(data, detsLength){
	var ab1DataObject = {
			dets_length : detsLength,
			communication_status : 1,
			key_switch_status: (data & 0b1),
			cable_fault: (data & 0b10) >> 1,
			earth_leakage: (data & 0b100) >> 2,
			mains: (data & 0b1000) >> 3,
			shaft_fault: (data & 0b10000) >> 4,
			DC_supply_voltage_status: (data & 0b100000) >> 5,
			low_bat: (data & 0b1000000) >> 6,
			too_low_bat: (data & 0b10000000) >> 7,
			blast_armed: (data & 0b100000000) >> 8,
			partial_blast_lfs: (data & 0b1000000000) >> 9,
			isolation_relay: (data & 0b10000000000) >> 10
	}
	return ab1DataObject;
}

 function createEddObject(data, window, delay, parentSerial){
	var eddObject = {
		serial : null,
		type_id : "edd",
		parent_serial : parentSerial,
		data : createEddDataObject(data, window, delay) 
	}
	return eddObject;
}

function createEddDataObject(data, window ,delay){
	var eddDataObject = {
		communication_status : 1,
		window_id : window,
		delay : delay,
		energy_storing: (data & 0b1),
		bridge_wire: (data & 0b10) >> 1,
		calibration: (data & 0b100) >> 2,
		program: (data & 0b1000) >> 3,
		det_fired: (data & 0b10000) >> 4 ,
		tagged: (data & 0b100000) >> 5,
		detonator_status:(data & 0b1000000) >> 6
	}
	return eddDataObject;
}