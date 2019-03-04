let dateFns = require('date-fns');
let ora = require('ora');
let client = require('./client');
let args = require('./args');
let config = require('./config');
let { buildSearch } = require('./searchHelper');

let {
  index, hostname, size, query, time
} = args.parse();

function buildLine(source, hostnameKey, messageKey) {
  let timestamp = dateFns.format(source['@timestamp'], 'MM/DD/YYYY HH:mm:ss');

  return `[${timestamp}] [${source[hostnameKey]}] ${source[messageKey]}`;
}

let hostnameKey;
let messageKey;
let timestampKey;

try {
  if (!config.indices[index]) {
    console.log('Could not load config for specified index.');
    process.exit(1);
  }

  hostnameKey = config.indices[index].hostnameKey;
  messageKey = config.indices[index].messageKey;
  timestampKey = config.indices[index].timestampKey;
}
catch (error) {
  console.trace(error.message);
  process.exit(1);
}

async function search() {
  let must = [];

  if (query) {
    must.push({ match: { [messageKey]: { query, operator: 'and', lenient: true } } });
  }

  if (hostname && typeof hostname === 'string') {
    must.push({ wildcard: { [hostnameKey]: hostname.toLowerCase() } });
  }

  must.push({ range: { [timestampKey]: { lt: time } } });

  let searchBody = buildSearch(
    query, index, size, hostname, time, messageKey, timestampKey, hostnameKey
  );

  return client.search(searchBody);
}

async function init() {
  try {
    let spinner = ora().start();

    let responseQueue = [];
    let messages = [];

    try {
      responseQueue.push(await search());
    }
    catch (error) {
      spinner.stop();
      console.log(error);
      console.log('There was an error while searching. Aborting.');
      process.exit(1);
    }

    while (responseQueue.length) {
      let res = responseQueue.shift();

      messages = messages.concat(
        res.hits.hits.map(
          h => h._source
        ).map(
          s => buildLine(s, hostnameKey, messageKey)
        )
      );

      if (messages.length === res.hits.total || messages.length >= size) {
        break;
      }

      /* eslint-disable no-await-in-loop */
      responseQueue.push(
        await client.scroll({
          scrollId: res._scroll_id,
          scroll: '30s'
        })
      );
    }

    spinner.stop();

    if (messages.length) {
      // we reverse here because we sort descending in the search
      // to get the most recent x results,
      // but we want to show to the user in ascending order
      console.log(messages.reverse().join('\n'));
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
