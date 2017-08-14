/* mysql.js
created by : Tim Buckley
2017/07/21 */

var pool;

module.exports = {
	
	initialise : function (){
		var mysql = require('mysql');
		pool = mysql.createPool({
			host: "localhost",
			user: "root",
			password: "root",
			database: "ibspiui"
		});
	},
	
	
	getConnection : function (pool, callback) {
		pool.getConnection(function (err, connection) {
			if (err)
				return callback(err);

			return callback(null, connection);
		});
	},
	
	getNodeData : function (callback){
		this.getConnection(pool, function (err, connection) {
			if (err)
				return callback(err);
			var query = 'SELECT * FROM nodes ORDER BY type_id';
			connection.query(query, function (err, result) {
				if (err) {
					connection.release();
					return callback(err);
				} else {
					connection.release();
					callback(null, result);
				}
			});
		});
	},
	
	getIscSerials : function (callback){
		this.getConnection(pool, function (err, connection) {
			if (err)
				return callback(err);
			var query = 'SELECT serial FROM nodes WHERE type_id = 1  ORDER BY serial';
			connection.query(query, function (err, result) {
				if (err) {
					connection.release();
					return callback(err);
				} else {
					connection.release();
					callback(null, result);
				}
			});
		});
	},
	
	insertNodeData : function (data, callback){
		this.getConnection(pool, function (err, connection) {
			if (err)
				return callback(err);
			var query = buildInsertQuery(data);
			connection.query(query, function (err, result) {
				if (err) {
					connection.release();
					return callback(err);
				} else {
					connection.release();
					callback(null, result);
				}
			});
		});
	},
	
	updateNodeData : function (data, callback){
		this.getConnection(pool, function (err, connection) {
			if (err)
				return callback(err);
			var query = buildUpdateQuery(data);
			connection.query(query, function (err, result) {
				if (err) {
					connection.release();
					callback(err, null);
				} else {
					connection.release();
					callback(null, result);
				}
			});
		});
	},
	
	getId : function (serial, type_id, callback){
		this.getConnection(pool, function (err, connection){
			if(err)
				callback(err, null);
			else{
				connection.query("SELECT id FROM nodes WHERE serial = ? AND type_id = ?", [serial, type_id], function (err, result){
					if(err)
						callback(err, null);
					else{
						callback(null, result[0]['id']);
					}
				});
			}
		});
	}
	
}

function buildInsertQuery(data){	
	var query = "INSERT INTO nodes ";
	var properties = "(serial,type_id,";
	var values = "VALUES(" + data.serial + ","  + data.type_id + ",";
	
	for (var property in data.data){
		if(data.data[property] != null){
			properties += property + ",";
			values += data.data[property] + ",";
		}
	}
	properties = properties.substr(0, properties.length - 1);
	values = values.substr(0, values.length - 1);
	properties += ") ";
	values += ") ";
	query += properties + values;
	return query;
}

function buildUpdateQuery(data){	
	var query = "UPDATE nodes SET ";
	console.log(data);
	for (var property in data.data){
		if(data.data[property] != null){
			query += property + "=";
			query += data.data[property] + ",";
		}
	}
	query = query.substr(0, query.length - 1);
	query += " WHERE serial = ";
	query += data.serial;
	query += " AND type_id = ";
	switch(data.type_id){
		case 'ibc' :
			query += 0;
			break;
			
		case 'isc' :
			query += 1;
			break;
			
		case 'ib651' :
			query += 2;
			break;
			
		case 'ab1' :
			query += 3;
			break;
			
		case 'edd' :
			query += 4;
			break;
			
	}
	console.log(query);
	return query;
}

