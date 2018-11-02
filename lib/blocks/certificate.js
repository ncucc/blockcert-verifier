const Base = require('./base');

function Certificate(data, retriever) {
    Base.call(this, data, retriever);
}

Certificate.prototype = Object.create(new Base());

Certificate.prototype.postRetrieve = function() {
    let self = this;

    return new Promise(function (resolve, reject) {
        Base.prototype.postRetrieve.call(self)
            .then(success => {
                self.retriever.read(self.data.data.creativeWork)
                    .then(creativeWorkData => {
                        self.retriever.read(self.data.data.badge)
                            .then(badgeData => {
                                self.creativeWork = creativeWorkData;
                                self.badge = badgeData;
                                resolve(success);
                            })
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
                console.log("***************************");
                console.log(self.data.data.badge);
                // resolve(success);
            })
            .catch(err => reject(err));
    });
}

Certificate.prototype.show = function() {
    console.log("######### CERTIFICATE #########");
    this.prevData.show(false);
    this.badge.show(false);
    this.creativeWork.show(false);
}

module.exports = Certificate;