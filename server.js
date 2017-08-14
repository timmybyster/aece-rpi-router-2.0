/* server.js
created by : Tim Buckley
2017/07/25 */

var pubnub = require('./pubnub');
var serial = require('./serialPort');
var tcpServer = require('./tcpServer');
var iscComms = require('./iscCommsHandler');
var mysql = require('./mysql');

pubnub.initialise();
serial.initialise();
//tcpServer.initialise();
mysql.initialise();
//iscComms.initialise();


	