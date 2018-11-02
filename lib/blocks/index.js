const badge = require('./badge');
const certificate = require('./certificate');
const conference = require('./conference');
const merkleRoot = require('./merkle_root');
const scholarlyArticle = require('./scholarly_article');


module.exports = {
    MerkleRoot: merkleRoot,
    Conference: conference,
    Badge: badge,
    ScholarlyArticle: scholarlyArticle,
    Certificate: certificate
};