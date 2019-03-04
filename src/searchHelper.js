module.exports = {
  buildSearch: (
    query, index, size, hostname, time, messageKey, timestampKey, hostnameKey
  ) => {
    if (query == null || query.length === 0) {
      query = '*';
    }

    if (hostname && typeof hostname === 'string') {
      query = `${query} AND ${hostnameKey}:"${hostname}"`;
    }

    let searchRequest = {
      _source: [timestampKey, hostnameKey, messageKey],
      scroll: '30s',
      index,
      size: size > 10000 ? 10000 : size,
      body: {
        sort: [{
          [timestampKey]: {
            order: 'desc',
            unmapped_type: 'boolean'
          }
        }],
        query: {
          bool: {
            must: {
              query_string: {
                analyze_wildcard: true,
                default_field: messageKey,
                query
              }
            },
            filter: {
              bool: {
                must: [],
                must_not: []
              }
            }
          }
        }
      }
    };

    // Add time range filter
    if (time != null) {
      let rangeQuery = {
        range: {
          [timestampKey]: {
            lt: time
          }
        }
      };

      searchRequest.body.query.bool.filter.bool.must.push(rangeQuery);
    }

    return searchRequest;
  }
};
