let args = require('minimist')(process.argv.slice(2));
let package = require('../package.json');

function parse() {
  if (args.help) {
    let help = `Usage: eslogs index [options]
  
Options:
-q query           A free-text search.
-s n               Return n latest results. Higher sizes take longer. Default 100.
-h name            Only show logs from hosts that match this name.
--version          Show version number.
  
Examples:
eslogs logstash-*
eslogs logstash-* -q error
eslogs logstash-* -q "192.168.1.100"
eslogs logstash-* -q "failed with error"
eslogs logstash-* -q error -h myhost
eslogs logstash-* -q error -h 192.168.1.1
eslogs logstash-* -q error -s 1000 | less -S
watch eslogs logstash-* error -s 30
  `;

    console.log(help);
    process.exit();
  }

  if (args.version) {
    console.log(package.version);
    process.exit();
  }

  let index = args._[0];

  if (!index) {
    console.log('Index not specified.');
    process.exit();
  }

  return {
    index,
    hostname: args.h,
    size: args.s || 100,
    query: args.q
  };
}

module.exports = {
  parse
};
