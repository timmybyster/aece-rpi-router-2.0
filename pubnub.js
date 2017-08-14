/* pubnub.js
created by : Tim Buckley
2017/07/21 */

var PUBNUB;

module.exports = {
	
	initialise : function (){
		var env = require('./environmentVariables');
		var pubNub = require('pubnub');
			PUBNUB = new pubNub({
			ssl           : true,
			publish_key   : env.PUBNUB.PUBLISH_KEY,
			subscribe_key : env.PUBNUB.SUBSCRIBE_KEY
		});
		
		PUBNUB.addListener({
			status: function(statusEvent) {
				if (statusEvent.category === "PNConnectedCategory") {
				}
			},
			message: function(message) {
				var pubnub = require('./pubnub');
				var dataBuilder = require('./dataBuilder');
				dataBuilder.handleMessage(message.message, function(err, result){
					console.log(result);
					pubnub.publish(result, 'requestChannel', function (err, result){
						if(err)
							console.log(err);
						else
							console.log(result);
					});
				});
			},
			presence: function(presenceEvent) {
				console.log("attempted Access");
			}	
		})

		PUBNUB.subscribe({
			channels: ['requestChannel']
		});     
	},

	
	publish : function (message, channel, callback){
			PUBNUB.publish({
			channel   : channel,
			message   : message,
			callback  : function(e) { 
				callback(null, e)
			},
			error     : function(e) { 
				callback(e, null);
			}
		});
	}
}



