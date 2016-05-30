(function() {

if (window.CrBug) {
  return;
}

function queryString(query) {
  var queryParts = [];
  if ('user' in query) {
    queryParts.push('owner:' + query.user);
  }
  if ('type' in query) {
    queryParts.push('Type=' + query.type);
  }
  if ('components' in query) {
    queryParts.push('component:' + query.components.join(','));
  }
  return queryParts.join(' ');
}

function queryURL(query) {
  return 'https://bugs.chromium.org/p/chromium/issues/list?can=2&q=' + encodeURIComponent(queryString(query));
}

window.CrBug = {
  queryString,
  queryURL,
};

})();