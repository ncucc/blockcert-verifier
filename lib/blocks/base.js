const verifier = require('../verifier');

function Base(data, retriever) {
    this.data = data;
    this.retriever = retriever;
}

Base.prototype.postRetrieve = function() {
    let self = this;

    return new Promise(function (resolve, reject) {
        if (typeof(self.data.data.prevBundle) !== 'undefined') {
            self.retriever.read(self.data.data.prevBundle)
                .then(data => {
                    verifier(self.data.blockData.payload, data.data.data.publicKey, self.data.blockData.signature)
                        .then(success => {
                            if (success) {
                                self.prevData = data;
                                resolve(data);
                            } else {
                                reject(new Error("Digital Signature incorrect!"));
                            }
                        })
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        } else {
            reject(new Error("Should have prevBundle to check signature"));
        }
    });
}

Base.prototype.show = function(recursive) {
    // console.log(this.data.blockData);

    if (recursive && (typeof this.prevData !== 'undefined')) {
        this.prevData.show(recursive);
    }
    console.log(this.data.data);
}

module.exports = Base;