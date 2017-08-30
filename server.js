/* server.js
created by : Tim Buckley
2017/07/25 */

var pubnub = require('./pubnub');
var serial = require('./serialPort');
var tcpServer = require('./tcpServer');
var iscComms = require('./iscCommsHandler');
var mysql = require('./mysql');
var env = require('./environmentVariables');

serial.initialise();

if(env.PUBNUB.ACTIVE == 1)
	pubnub.initialise();

if(env.TCP.ACTIVE == 1)
	tcpServer.initialise();

if(env.MYSQL.ACTIVE == 1)
	mysql.initialise();

if(env.ISC_COMMS.ACTIVE == 1)
	iscComms.initialise();


	