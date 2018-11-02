const crypto = require('crypto');
const te = require('text-encoding');

const CHAR_CODE_OF_9 = '9'.charCodeAt(0);
const CHAR_CODE_OF_A = 'A'.charCodeAt(0);
const CHECKSUM_MAGIC_NUMBER = 1;
const IOTA_STORE_SIGNATURE = 'A';

function codeToInt(code) {
    return code == CHAR_CODE_OF_9 ? 0 : (code - CHAR_CODE_OF_A + 1);
}

function checkSignature(data) {
	return data[0] == IOTA_STORE_SIGNATURE;
}

function checkChecksum(data) {
	let sum = 0;
	for (let i = 0; i < data.length; i++) {
		sum += codeToInt(data.charCodeAt(i));
	}
	return sum % 27 == CHECKSUM_MAGIC_NUMBER;
}

function dataLength(data) {
	let len = 0;

	for (let i = 0; i < 5; i++) {
		len = len * 27 + codeToInt(data.charCodeAt(i + 1));
	}
	return len;
}

function trytes2Bytes(data, from, numberOfBytes, callback) {
    let n = Math.ceil(numberOfBytes * 8 / 19);
    let byteValue = 0;
    let bits = 0;
    let bytes = 0;

    for (let i = 0; i < n; i++) {
        let sum = 0;

    	for (let j = 0; j < 4; j++) {
    		sum = sum * 27 + codeToInt(data.charCodeAt(from + i * 4 + j));
		}
		// console.log("sum = " + sum);
		for (let k = 0; k < 19; k++) {
            let v = ((sum & 262144) != 0) ? 1 : 0;
			 byteValue = (byteValue << 1) + v;
             // console.log(">> " + sum + ", v = " + v + ", byteValue = " + byteValue);
			 sum = (sum << 1) & 524287;
			 bits++;
			 if (bits == 8) {
			 	callback(byteValue);
			 	byteValue = 0;
			 	bits = 0;
			 	bytes++;

			 	if (bytes == numberOfBytes) return;
			 }
		}
	}
}

function decimalToHex(d, padding) {
    let hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

function readSha255(data) {
    let buffer = new Uint8Array(32);
    let index = 0;

	trytes2Bytes(data, 6, 32, function (byteValue) {
		buffer[index++] = byteValue;
	});

	let result = "";
	for (let i = 0; i < 32; i++) {
		result = result + decimalToHex(buffer[i], 2);
	}
	return result;
}

function rootBlock(data, isGenesisBlock) {
    if (! checkSignature(data)) {
    	throw new Error("signature not found");
	} else if (! checkChecksum(data)) {
		throw new Error("block checksum error");
	} else {
        this.sha265 = readSha255(data);
        this.dataLength = dataLength(data);
        let rawData = this.readData(data);


        const hash = crypto.createHash('sha256');
        hash.update(rawData);

        if (hash.digest('hex') == this.sha265) {
            this.blockData = JSON.parse(new te.TextDecoder("utf-8").decode(rawData));

            if (this.blockData.type == 'MerkleRoot') {
            	if (isGenesisBlock) {
                    this.data = this.blockData;
                    console.log("Genesis Block found!");
                } else {
            		throw new Error("MerkleRoot should be the Genesis Block");
				}
			} else {
                this.data = JSON.parse(this.blockData.payload);

                if (this.data.type !== this.blockData.type) {
                	throw new Error("Fake type");
				} else if (typeof(this.data.prevBundle) == "undefined") {
                	throw new Error("Should have prevBundle");
				}
            }
        } else {
            throw new Error("sha256sum error");
        }
    }
}

rootBlock.prototype.readData = function(data) {
    let buffer = new Uint8Array(this.dataLength);
    let index = 0;

    trytes2Bytes(data, 62, this.dataLength, function (byteValue) {
        buffer[index++] = byteValue;
    });

    return buffer;
}

function dataBlock(data) {
}

module.exports = { rootBlock: rootBlock, dataBlock: dataBlock };
