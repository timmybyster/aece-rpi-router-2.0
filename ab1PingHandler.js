/* ab1PingHandler.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	createNodeFromPacket : function(packet){
		var ab1 = createAb1Object(packet.source);									//Create an AB1 object
		var eddLength = packet.data.length/5;										//determine the number of EDDs based on the length of the data
		var eddSerialArray, eddSerial, eddWindow;									//define temporary variables for the EDD data
		for (var i = 0; i < eddLength; i++){										//for each EDD
			eddSerialArray = packet.data.splice(0,5);								//get the next EDD ip and window data
			eddSerial = (eddSerialArray[0] << 24) & 0xFF000000;						//get the Bytes of the IP
			eddSerial |= (eddSerialArray[1] << 16) & 0xFF0000;
			eddSerial |= (eddSerialArray[2] << 8) & 0xFF00;
			eddSerial |= (eddSerialArray[3]) & 0xFF;
			ab1.children.push(createEddObject(eddSerial, eddSerialArray[4], packet.source));//create the edd object and add it as a child of the AB1
		}
		return ab1;																	//return the AB1 object
	}
}

function createAb1Object(serial){
	var ab1Object = {																//create an AB1 object
		serial : serial,															//define its serial number
		type_id : "ab1",															//define its type_id
		data : {communication_status : 1},											//define its communication_status as TRUE
		children : []																//initalise its array of children
	}
	return ab1Object; 																//return the AB1 object
}

function createEddObject(serial, window, parentSerial){
	var eddObject = {																//create an EDD object
		serial : serial,															//define its serial Number
		type_id : "edd",															//define its type ID
		data : {communication_status : 1, window_id : window},						//set its communication_status to true and its window 
		parent_serial : parentSerial												//define its parent serial
	}
	return eddObject;																//return the EDD object
}