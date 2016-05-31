(function() {

if (window.CrBug) {
  return;
}

function queryString(query) {
  var queryParts = [];
  // TODO(alancutter): Make this function just pass through the key value pairs in the right format.
  if ('user' in query) {
    queryParts.push('owner:' + query.user);
  }
  if ('type' in query) {
    queryParts.push('Type=' + query.type);
  }
  if ('components' in query) {
    queryParts.push('component:' + query.components.join(','));
  }
  if ('label' in query) {
    queryParts.push('label:' + query.label);
  }
  if ('-has' in query) {
    queryParts.push('-has:' + query['-has']);
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
