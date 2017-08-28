/* ibcDataHandler.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	createNodeFromPacket : function(packet){
		var ibcDataArray = packet.data.splice(0,2);						//Sepearte the IBC Data 
		var ibcData = ibcDataArray[1];									//Get the IBC data
		var ibc = createIbcObject(packet.source, ibcData);				//create the IBC object
		return ibc;
	}
}

function createIbcObject(serial, data){
	var ibcObject = {													//create an IBC object
		serial : serial,												//define its serial number
		type_id : "ibc",												//define its type ID
		data : createIbcDataObject(data),								//create its data Object
		children : []													//initalise its children
	}
	return ibcObject; 													//return the IBC object
}

function createIbcDataObject(data){
	var ibcDataObject = {
			communication_status : 1,
			key_switch_status: (data & 0b10000000) >> 7,
			isolation_relay: (data & 0b01000000) >> 6,
			fire_button: (data & 0b00100000) >> 5,
			cable_fault: (data & 0b00010000) >> 4,
			earth_leakage: (data & 0b00001000) >> 3
	}
	return ibcDataObject;
} 