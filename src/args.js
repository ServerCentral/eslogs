let args = require('minimist')(process.argv.slice(2));

function parse() {
  if (args.help) {
    let help = `Usage: eslogs index [-q query | ...] [options]
  
  -q query                           A free-text search
  
  Options:
  -s n                               Return n latest results. Higher sizes take longer. Default 100.
  -h name                            Only show logs from hosts that match this name.
  
  Examples:
  eslogs ms-*
  eslogs ms-* -q error
  eslogs ms-* -q "192.168.1.100"
  eslogs ms-* -q "failed with error"
  eslogs ms-* -q error -h c14714
  eslogs ms-* -q error -h 208.*
  eslogs ms-* -q error -s 1000 | less -S
  watch eslogs ms-* error -s 30
  `;

    console.log(help);
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
