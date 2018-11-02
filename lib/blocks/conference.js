const Base = require('./base');

function Conference(data, retriever) {
    Base.call(this, data, retriever);
}

Conference.prototype = Object.create(new Base());

Conference.prototype.show = function() {
    console.log("[Conference] Name: " + this.data.data.name);
    console.log("[Conference] Location: " + this.data.data.location);
    console.log("[Conference] Date: " + this.data.data.startDate + " to " + this.data.data.endDate);
    console.log("[Conference] URL: " + this.data.data.url);
    console.log("[Conference] Event Public Key: " + this.data.data.publicKey);
}

module.exports = Conference;