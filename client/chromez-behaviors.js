window.ChromeZBehaviors = window.ChromeZBehaviors || {};
ChromeZBehaviors.AJAXBehavior = {
  update: function() {
    for (var i = 0; i < this.searchQueries.length; i++) {
      this.searchQueries[i].element.generateRequest();
    }
  },
  addCallbackToQuery: function(query, key, callback, defaults) {
    for (var i = 0; i < this.searchQueries.length; i++) {
      if (this.searchQueries[i][key] == query[key]) {
        this.searchQueries[i].callbacks.push(callback);
        if (this.searchQueries[i].dataCache)
          callback(this.searchQueries[i].dataCache);
        return true;
      }
    }
    searchQuery = {callbacks: [callback], params: defaults};
    searchQuery[key] = query[key];
    this.push('searchQueries', searchQuery);
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

    query.dataCache = result;
    query.element = data.target;
    for (var i = 0; i < query.callbacks.length; i++)
      query.callbacks[i](result);
  },
}
