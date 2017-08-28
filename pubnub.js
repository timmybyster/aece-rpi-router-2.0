/* pubnub.js
created by : Tim Buckley
2017/07/21 */

var PUBNUB;															//create a global variable

module.exports = {
	
	initialise : function (){
		var env = require('./environmentVariables');				//get the environmentVariables					
		var pubNub = require('pubnub');								//get the pubnub module
			PUBNUB = new pubNub({									//initialise the Pubnub keys
			ssl           : true,
			publish_key   : env.PUBNUB.PUBLISH_KEY,
			subscribe_key : env.PUBNUB.SUBSCRIBE_KEY
		});
		
		PUBNUB.addListener({										//create a pubnub message listener
			status: function(statusEvent) {							//create an event on the status of the pubnub connection
				if (statusEvent.category === "PNConnectedCategory") {
				}
			},
			message: function(message) {							//create an event on the reception of a message
				var pubnub = require('./pubnub');					//get this module as a variable
				var dataBuilder = require('./dataBuilder');			//get the data builder module as a variable
				dataBuilder.handleMessage(message.message, function(err, result){//pass the message to the data builder
					pubnub.publish(result, 'requestChannel', function (err, result){//publish the repsonse to the request channel
						if(err)										//if there is an error
							console.log(err);						//log the error
						else										//otherwise
							console.log(result);					//log the result
					});
				});
			},
			presence: function(presenceEvent) {						//if there is a new connection made on the channel
				console.log("attempted Access");					//log it
			}	
		})

		PUBNUB.subscribe({											//subscribe the listener
			channels: ['requestChannel']							//set the subscription channel
		});     
	},

	
	publish : function (message, channel, callback){
			PUBNUB.publish({										//publish the message to pubnub
			channel   : channel,									//set the channel
			message   : message,									//set the message
			callback  : function(e) { 								//set the callback
				callback(null, e)									//pass the pubnub callback to the function callback
			},
			error     : function(e) { 								//set the error
				callback(e, null);									//pass the error to the function callback
			}
		});
	}
}



