window.ChromeZBehaviors = window.ChromeZBehaviors || {};
ChromeZBehaviors.AJAXBehavior = {
  update: function() {
    for (var i = 0; i < this.searchQueries.length; i++) {
      this.searchQueries[i].element.generateRequest();
    }
  },
  addCallbackToQuery: function(query, callback, params) {
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
      callbacks: [callback],
      params: params,
      key: queryKey,
    });
  },
  properties: {
    searchQueries: {
      type: Object,
      value: function() { return []; }
    }
  },
  handleResponse: function(data) {
    var query = this.searchQueries[data.model.index];
    var result = data.detail.response;
    if (this.onResponse)
      result = this.onResponse(result);
    if (query.dataCache && JSON.stringify(query.dataCache) == JSON.stringify(result)) {
      return;
    }
    query.dataCache = result;
    query.element = data.target;
    for (var i = 0; i < query.callbacks.length; i++)
      query.callbacks[i](clone(result));
  },
}

function clone(data) {
  if (data instanceof Object && data.clone instanceof Function) {
    return data.clone();
  }
  return JSON.parse(JSON.stringify(data));
}
