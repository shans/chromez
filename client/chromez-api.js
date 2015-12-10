var registry = undefined;

function registerSource(type, query, callback) {
  if (registry == undefined)
    registry = document.querySelector('cz-registry');
  if (registry)
    return registry.registerSource(type, query, callback);
  // TODO: manually construct source and register query on it
  // when no registry exists on the page.
}
