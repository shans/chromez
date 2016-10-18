(function() {

if (window.Crbug) {
  return;
}

function queryString(query) {
  return Object.keys(query).map(key => key + '=' + query[key]).join(' ');
}

function queryURL(query) {
  return 'https://bugs.chromium.org/p/chromium/issues/list?can=2&q=' + encodeURIComponent(queryString(query));
}

window.Crbug = {
  queryString,
  queryURL,
};

})();
