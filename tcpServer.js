/* tcpServer.js
created by : Tim Buckley
2017/08/11 */

var net = require('net');
var writeSocket;

module.exports = {
	initialise : function(){
		var env = require('./environmentVariables');						//get the environment Variables
		var server = net.createServer(function(socket) {					//create a new socket
			writeSocket = socket;											//set the socket as a global variable
			socket.on('data', function(data){								//create an event on any data received on the socket
				textData = data.toString('utf8');							//convert the data to utf8 ASCII
				var dataBuilder = require('./dataBuilder');					//get the data Builder
				dataBuilder.handleMessage(textData, function(err, result){	//pass the text received to the data Handler
					if(err)													//if there is an error
						console.log(err);									//log it
					else{													//otherwise
						console.log("TCP RESPONSE WRITTEN");				//Log the response was written
						socket.write(JSON.stringify(result));				//write the JSON object as a string to the 
					}
				});
			});
		});
		server.listen(env.TCP.PORT, env.TCP.BIND_ADDRESS);					//create a listener on the specified port and address
	},
	
	write : function (object, callback){
		try{																//try writing the message to the socket
			writeSocket.write(JSON.stringify(object), function (err){		//write the object to the socket as string
				if(err)														//if there is an error 
					callback(err, null);									//pass it to the callback
				else														//otherwise
					callback(null, "TCP UPDATE WRITTEN");					//pass a success message to the callback
			});
		}
		catch(err){															//if there is an error with socket
			callback("NO LOCAL TCP CONNECTION", null);						//log that there is no connection
		}
	}
}