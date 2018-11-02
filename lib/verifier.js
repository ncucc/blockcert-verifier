const { spawn } = require('child_process');
const tmp = require('tmp');
const fs = require('fs');

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

module.exports = function(rawData, publicKey, signature) {
    return new Promise(function (resolve, reject) {
        tmp.file(function (err, path, fd, cleanupCallback) {
            if (err) {
                reject(err);
            } else {
                fs.writeSync(fd, publicKey + "\n");
                fs.writeSync(fd, signature + "\n");
                fs.writeSync(fd, rawData +"\n");


                const ecdsaVerifier = spawn('java' , [ 'ECDSA_Verifier', path ]);

                ecdsaVerifier.stdout.on('data', (data) => {
                    // console.log(`stdout: ${data}`);
                });

                ecdsaVerifier.stderr.on('data', (data) => {
                    // console.log(`stderr: ${data}`);
                });

                ecdsaVerifier.on('close', (code) => {
                    console.log(`verify signature: ${code == 0 ? "success" : "failed"}`);
                    cleanupCallback();

                    resolve(code == 0);
                });
            }
        });
    });
}
