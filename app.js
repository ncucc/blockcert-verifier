// Find an IOTA_HOST in https://iota.dance/
const IOTA_HOST = 'https://node04.iotatoken.nl:443'

const Retriever = require('./lib')
const retriever = new Retriever(IOTA_HOST)

process.argv.slice(2).forEach(function (val, index, array) {
    retriever.read(val)
        .then(data => {
        	console.log();
            data.show(false);
        })
        .catch(err => {
            console.log(err);
            console.log(err.stack);
        })
});
