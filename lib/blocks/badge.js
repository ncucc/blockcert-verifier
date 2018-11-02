const Base = require('./base');

function Badge(data, retriever) {
    Base.call(this, data, retriever);
}

Badge.prototype = Object.create(new Base());

Badge.prototype.show = function() {
    console.log("[Award]: " + this.prevData.data.data.name + " / " + this.data.data.name);
}

module.exports = Badge;