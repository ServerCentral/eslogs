let fs = require('fs');
let homedir = require('os').homedir();

let config = {};

try {
  let configFile = fs.readFileSync(`${homedir}/.eslogs.json`);
  config = JSON.parse(configFile);
}
catch (error) {
  console.log(`Could not read config file in ${homedir}/.eslogs.json. Quitting.`);
  process.exit(1);
}

module.exports = config;
