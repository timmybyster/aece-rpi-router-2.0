/* ab1DataHandler.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	createNodeFromPacket : function(packet){
		var ab1DataArray = packet.data.splice(0,4);							//seperate the data
		var ab1Window = ab1DataArray[0];									//Get the window From the data	
		var ab1Crc = ab1DataArray[1];										//get the CRC from the data
		var ab1Data = ab1DataArray[2] << 8;									//get the info Data MSB
		ab1Data |= ab1DataArray[3];											//get the info Data LSB
		var ab1 = createAb1Object(packet.source, ab1Data, ab1Window);		//create the data object from the split data
		var eddLength = (packet.data.length/4);								//determine the edd length based on the length of the remaining data
		var eddDataArray, eddData, eddWindow, eddDelay;						//Define variables to store the EDD data temporarily
		for (var i = 0; i < eddLength; i++){								//for each edd
			eddDataArray = packet.data.splice(0,4);							//Seperate the Edd data
			eddWindow = eddDataArray[0];									//get the Edd window 
			eddData = eddDataArray[1];										//get the edd Data
			eddDelay = eddDataArray[3] << 8;								//get the edd Delay MSB
			eddDelay |= eddDataArray[2];									//get the edd Delay LSB
			edd = createEddObject(eddData, i + 1, eddDelay, packet.source);	//create the EDD object from the split data
			ab1.children.push(edd); 										//add the edd as a child of the AB1
		}
		return ab1;															//return the AB1 object
	}
}

function createAb1Object(serial, data , window){
	var ab1Object = {														//define the AB1 object
		serial : serial,													//define its serial number
		type_id : "ab1",													//define its type_id
		data : createAb1DataObject(data, window),							//create a data object
		children : []														//initalise its children
	}
	return ab1Object; 														//return the object
}
	
function createAb1DataObject(data, detsLength){
	var ab1DataObject = {
			window_id : detsLength,
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
	var eddObject = {													//define the EDD object
		serial : window,												//there is no serial specified in this packet so set it as null
		type_id : "edd",												//define its type ID
		parent_serial : parentSerial,									//define its parent
		data : createEddDataObject(data, window, delay) 				//create a data object
	}
	return eddObject													//return the EDD object
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