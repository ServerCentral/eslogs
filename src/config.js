let fs = require('fs');
let homedir = require('os').homedir();

let configFile = null;
let config = {};

try {
  configFile = fs.readFileSync(`${homedir}/.eslogs.json`);
  config = JSON.parse(configFile);
}
catch (error) {}

try {
  configFile = fs.readFileSync('/etc/eslogs.json');
  config = JSON.parse(configFile);
}
catch (error) {}

if (!configFile) {
  console.log(`Could not read config file in ${homedir}/.eslogs.json nor /etc/eslogs.json. Quitting.`);
  process.exit(1);
}
module.exports = config;
