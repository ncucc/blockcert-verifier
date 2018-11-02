const Base = require('./base');

function ScholarlyArticle(data, retriever) {
    Base.call(this, data, retriever);
}

ScholarlyArticle.prototype = Object.create(new Base());

ScholarlyArticle.prototype.show = function() {
    console.log("[ScholarlyArticle] Title: " + this.data.data.headline);
    console.log("[ScholarlyArticle] Authors: " + JSON.stringify(this.data.data.authors));
    console.log("[ScholarlyArticle] Organizations: " + JSON.stringify(this.data.data.organizations));
    console.log("[ScholarlyArticle] PDF File: " + this.data.data.webViewLink);
    console.log("[ScholarlyArticle] PDF File sha256 checksum: " + this.data.data.sha256sum);
}


module.exports = ScholarlyArticle;