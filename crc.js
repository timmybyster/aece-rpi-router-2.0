/* crc.js
created by : Tim Buckley
2017/08/02 */

module.exports = {
	calculate : function (hexArr){
		var numBytes = hexArr.length;
		var crc = 0xffff;
		var resultData = null;

		// iterate through the byte array
		for (var length = 0; length < numBytes; length++) {

			resultData = (0xff & hexArr[length]);

			for (var i = 0; i < 8; i++) {
				if ((crc & 0x0001) ^ (resultData & 0x0001))
					crc = ((crc >> 1) ^ 0x8408);
				else  crc >>= 1;

				resultData >>= 1;
			}
		}

		crc = ~crc;
		resultData = crc;
		crc = (crc << 8) | (resultData >> 8 & 0xff);

		crc &= 0xffff;

		return crc;
	}
}