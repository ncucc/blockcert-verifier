const Base = require('./base');

function MerkleRoot(data, retriever) {
    Base.call(this, data, retriever);
}

MerkleRoot.prototype = Object.create(new Base());


module.exports = MerkleRoot;