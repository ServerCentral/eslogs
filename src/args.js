let args = require('minimist')(process.argv.slice(2));
let chrono = require('chrono-node');
let packageMeta = require('../package.json');

function parse() {
  if (args.help) {
    let help = `Usage: eslogs index [options]
  
Options:
-q query           A free-text search.
-s n               Return n latest results. Higher sizes take longer. Default 100.
-h name            Only show logs from hosts that match this name.
-t time            Start searching backwards from this date. Default 'now'.
--version          Show version number.
  
Examples:
eslogs logstash-*
eslogs logstash-* -q error
eslogs logstash-* -q "192.168.1.100"
eslogs logstash-* -q "\\"192.168.1.100\\" AND error"
eslogs logstash-* -q "failed with error"
eslogs logstash-* -q error -t "24 hours ago"
eslogs logstash-* -q error -t "monday"
eslogs logstash-* -q error -t "12/25/2018 midnight"
eslogs logstash-* -q error -h myhost
eslogs logstash-* -q error -h 192.168.1.1
eslogs logstash-* -q error -s 10000 | less -S
watch eslogs logstash-* -q error -s 30
  `;

    console.log(help);
    process.exit();
  }

  if (args.version) {
    console.log(packageMeta.version);
    process.exit();
  }

  let index = args._[0];

  if (!index) {
    console.log('Index not specified.');
    process.exit();
  }

  let time = 'now';

  if (args.t) {
    time = chrono.parseDate(args.t);
  }

  return {
    index,
    time,
    hostname: args.h,
    size: args.s || 100,
    query: `"${args.q}"` // surround in quotes for es
  };
}

module.exports = {
  parse
};
