window.ChromeZBehaviors = window.ChromeZBehaviors || {};
ChromeZBehaviors.AJAXBehavior = {
  update: function() {
    for (var i = 0; i < this.searchQueries.length; i++) {
      this.searchQueries[i].element.generateRequest();
    }
  },
  addCallbackToQuery: function(query, callback, params, paginated) {
    var queryKey = JSON.stringify(query);
    for (var i = 0; i < this.searchQueries.length; i++) {
      if (this.searchQueries[i].key == queryKey) {
        this.searchQueries[i].callbacks.push(callback);
        if (this.searchQueries[i].dataCache)
          callback(clone(this.searchQueries[i].dataCache));
        return true;
      }
    }
    this.push('searchQueries', {
      query: clone(query),
      callbacks: [callback],
      params: params,
      key: queryKey,
      paginated: paginated
    });
  },
  properties: {
    searchQueries: {
      type: Object,
      value: function() { return []; }
    }
  },
  handleResponse: function(data) {
    var searchQuery = this.searchQueries[data.model.index];
    var result = data.detail.response;
    if (this.onResponse) {
      result = this.onResponse(result, searchQuery);
      if (!result && searchQuery.paginated) {
        data.target.generateRequest();
        return;
      }
    }
    if (searchQuery.dataCache && JSON.stringify(searchQuery.dataCache) == JSON.stringify(result)) {
      return;
    }

    searchQuery.dataCache = result;
    searchQuery.element = data.target;
    for (var i = 0; i < searchQuery.callbacks.length; i++)
      searchQuery.callbacks[i](clone(result));
  },
}

function clone(data) {
  if (data instanceof Object && data.clone instanceof Function) {
    return data.clone();
  }
  return JSON.parse(JSON.stringify(data));
}
