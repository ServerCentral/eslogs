let elasticsearch = require('elasticsearch');
let config = require('./config');

const client = new elasticsearch.Client({
  host: config.host,
  log: 'warning'
});

module.exports = client;
