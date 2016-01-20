var registry = undefined;

function registerSource(type, query, callback) {
  if (registry == undefined)
    registry = document.querySelector('cz-registry');
  if (registry)
    return registry.registerSource(type, query, callback);
  // TODO: manually construct source and register query on it
  // when no registry exists on the page.
}

var cardview = undefined;

function addCard(card) {
  if (cardview == undefined)
    cardview = document.querySelector('cz-cardview');
  if (cardview)
    return Polymer.Base.async(function() { cardview.addCard(card) });
}

function removeCard(card) {
  if (cardview == undefined)
    cardview = document.querySelector('cz-cardview');
  if (cardview)
    return Polymer.Base.async(function() { cardview.removeCard(card); });
}
