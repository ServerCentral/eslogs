#!/usr/bin/env node

let fs = require('fs');
let path = require('path');
let homedir = require('os').homedir();

if (!fs.existsSync(`${homedir}/.eslogs.json`)) {
  fs.createReadStream(path.resolve(__dirname, 'eslogs.json')).pipe(fs.createWriteStream(`${homedir}/.eslogs.json`));
}
