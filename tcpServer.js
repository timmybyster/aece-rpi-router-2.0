/* tcpServer.js
created by : Tim Buckley
2017/08/11 */

var net = require('net');
var writeSocket;

module.exports = {
	initialise : function(){
		var server = net.createServer(function(socket) {
			writeSocket = socket;
			socket.on('data', function(data){
				textData = data.toString('utf8');
				var dataBuilder = require('./dataBuilder');
				dataBuilder.handleMessage(textData, function(err, result){
					if(err)
						console.log(err);
					else{
						console.log("TCP RESPONSE WRITTEN");
						socket.write(JSON.stringify(result));
					}
				});
			});
		});
		server.listen(2000, '192.168.1.79');
	},
	
	write : function (object, callback){
		try{
			writeSocket.write(JSON.stringify(object), function (err){
				if(err)
					callback(err, null);
				else
					callback(null, "TCP UPDATE WRITTEN");
			});
		}
		catch(err){
			callback("NO LOCAL TCP CONNECTION", null);
		}
	}
}