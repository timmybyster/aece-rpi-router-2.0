/* enviromentVariables.js
created by : Tim Buckley
2017/08/04 */

module.exports = {
	ISC_COMMS : {	INTERVAL : 1000,
					RETRIES : 4
				},
					
	PUBNUB : 	{	SUBSCRIBE_KEY : 'sub-c-782f064c-7d95-11e7-95ea-0619f8945a4f',
					PUBLISH_KEY : 'pub-c-de71bd7c-fda3-427f-86d4-93c89f7ae705'
				},
				
	SERIAL :	{	PORT : 'COM12',
					BAUD_RATE : 9600
				},
				
	JSON_DB :	{	FILE : './treeTest'
				},
				
	TCP : 		{	PORT : 2000,
					BIND_ADDRESS: 172.24.1.1
				}
				
}
