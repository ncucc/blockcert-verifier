const core = require('@iota/core');
const trytes = require('./trytes');
const blockTypes = require('./blocks');

const GENESIS_BLOCK = "RQPBZCECSSQVCZEAGJJDTLJZSIAPZAYIKATVWABIYCZORSCAGXBGEISRMJJJLDOPAKCVEFQXKDZSVXYCY";

function Retriever(provider) {
	console.log("using IOTA_HOST: " + provider);
	this.iota = core.composeAPI({ provider: provider });
}

Retriever.prototype.fetch = function (bundle) {
	var self = this;

	return new Promise(function (resolve, reject) {
		self.iota.findTransactionObjects({ bundles: [ bundle ] })
			.then(transactions => resolve(transactions[0].signatureMessageFragment))
			.catch(err => reject(err))
		});
}

Retriever.prototype.read = function (bundle) {
	var self = this;
	var isGenesisBlock = bundle == GENESIS_BLOCK;

	console.log("loading bundle: " + bundle);

	return new Promise(function (resolve, reject) {
		// resolve(new trytes.rootBlock(rawdata));

		self.fetch(bundle)
			.then(data => {
				var block = new trytes.rootBlock(data, isGenesisBlock);
				var blockType = block.data.type;

				if (blockType === 'undefined') {
					console.log("unknown type");
					reject("unknown type");
				} else {
					console.log("Type: " + blockType);
                    var Clazz = blockTypes[blockType];


                    if (typeof(Clazz) == 'function') {
                        var blockcertData = new Clazz(block, self);

                        if (isGenesisBlock) {
                        	resolve(blockcertData);
                        } else {
							blockcertData.postRetrieve()
								.then(result => resolve(blockcertData))
								.catch(err => reject(err));
						}
					} else {
                    	console.log("oops!! " + blockType);
					}
                }
			})
			.catch(err => reject(err));
	});
}

module.exports = Retriever;
