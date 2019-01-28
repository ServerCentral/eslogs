#!/usr/bin/env node
let search = require('./search');
let client = require('./client');

client.ping({
  requestTimeout: 5000
}, (error) => {
  if (error) {
    console.error('Cannot communicate with elasticsearch. Quitting.');
  }
  else {
    search.init();
  }
});
