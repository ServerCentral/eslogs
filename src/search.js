let dateFns = require('date-fns');
let ora = require('ora');
let client = require('./client');
let args = require('./args');
let config = require('./config');

let {
  index, hostname, size, query
} = args.parse();

function buildLine(source, hostnameKey, messageKey) {
  let timestamp = dateFns.format(source['@timestamp'], 'MM/DD/YYYY HH:MM:ss');

  return `[${timestamp}] [${source[hostnameKey]}] ${source[messageKey]}`;
}

async function init() {
  try {
    if (!config.indices[index]) {
      console.log('Could not load config for specified index.');
      process.exit();
    }

    let hostnameKey = config.indices[index].hostnameKey;
    let messageKey = config.indices[index].messageKey;
    let timestampKey = config.indices[index].timestampKey;

    let must = [];

    if (query) {
      must.push({ match: { [messageKey]: { query, lenient: true } } });
    }

    if (hostname) {
      must.push({ match: { [hostnameKey]: { query: hostname, lenient: true } } });
    }

    let spinner = ora().start();

    try {
      let res = await client.search({
        index,
        body: {
          query: {
            bool: {
              must
            }
          },
          sort: [
            {
              [timestampKey]: {
                order: 'desc'
              }
            }
          ]
        },
        size
      });

      let hits = res.hits.hits;
      let messages = hits.map(h => h._source).map(s => buildLine(s, hostnameKey, messageKey));

      if (messages.length) {
        console.log(messages.reverse().join('\n'));
      }
    }
    catch (error) {
      console.log('There was an error while searching. Aborting.');
      process.exit(1);
    }
    finally {
      spinner.stop();
    }
  }
  catch (error) {
    console.trace(error.message);
    process.exit(1);
  }
}

module.exports = {
  init
};
