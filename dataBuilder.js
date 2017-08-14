/* dataBuilder.js
created by : Tim Buckley
2017/07/25 */

module.exports = {
	handleMessage : function (parsedMessage, callback){
		switch(parsedMessage){
			case "CONFIG_REQUEST" :
				buildConfig(function (err, config){
					if(err)
						callback(err, null);
					else
						callback(null, createConfigResponseObject(config));
				});
				break;
				
			case "PING_REQUEST" :
				buildPing(function (err, ping){
					if(err)
						callback(err, null)
					else
						callback(null, createPingResponseObject(ping));
				});
				break;
		}
	}
}

function buildConfig(callback){
	var jsonDB = require('./jsonDB');
	jsonDB.getAll(function(err, tree){
		if(err)
			callback(err, null);
		else
			callback(null, createIbc(tree.ibc));
	});
}

function createConfigResponseObject(info){
	var pubnubResponseObject = {
		config : info
	};
	return pubnubResponseObject;
}

function createPingResponseObject(info){
	var pubnubResponseObject = {
		ping : createPingInfoObject(info)
	};
	return pubnubResponseObject;
}

function createPingInfoObject(info){
	var pingInfoObject = {
		units : info,
		time : Date.now()
	}
	return pingInfoObject;
}
	
function buildPing(callback){
	var jsonDB = require('./jsonDB');
	jsonDB.getAll(function(err, tree){
		if(err)
			callback(err, null);
		else
			callback(null, countUnits(tree.ibc));
	});
}

function countUnits(tree){
	var units = 1;
	for(var isc in tree.isc){
		units++;
		for (var ib651 in tree.isc[isc].ib651){
			units++;
		}
	}
	
	for(var ab1 in tree.ab1){
		units++;
		for (var edd in tree.ab1[ab1].edd){
			units++;
		}
	}
	return units;
}

function createIbc(tree){
	var ibc = {
		serial : tree.serial,
		type_id : tree.type_id,
		data : tree.data,
		children : []
	}
	for(var isc in tree.isc){
		ibc.children.push(createIsc(tree.isc[isc], ibc.serial));
	}
	for(var ab1 in tree.ab1){
		ibc.children.push(createAb1(tree.isc[isc], ibc.serial));
	} 
	return ibc;
}

function createIsc(tree, parentSerial){
	var isc = {
		serial : tree.serial,
		type_id : tree.type_id,
		parent_serial : parentSerial,
		data : tree.data,
		children : []
	}
	
	for(var ib651 in tree.ib651){
		isc.children.push(createIb651(tree.ib651[ib651], isc.serial));
	}
	return isc;
}

function createIb651(tree, parentSerial){
	var ib651 = {
		serial : tree.serial,
		type_id : tree.type_id,
		parent_serial : parentSerial,
		data : tree.data
	}
	return ib651;
}

function createAb1(tree, parentSerial){
	var ab1 = {
		serial : tree.serial,
		type_id : tree.type_id,
		parent_serial : parentSerial,
		data : tree.data,
		children : []
	}
	
	for(var edd in tree.edd){
		ab1.children.push(createEdd(tree.edd[edd], ab1.serial));
	}
	return ab1;
}

function createEdd(tree, parentSerial){
	var edd = {
		serial : tree.serial,
		type_id : tree.type_id,
		parent_serial : parentSerial,
		data : tree.data
	}
	return edd;
}