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
var dashview = undefined;

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

function addDash(dashSpec, elementAfter) {
  if (typeof dashSpec == "object") {
    var dash = dashSpec.name;
    var key = dashSpec.key;
  } else if (dashSpec.indexOf("(") > -1) {
    var bits = dashSpec.split("(");
    var dash = bits[0];
    var key = bits[1].split(")")[0];
  } else {
    var dash = dashSpec;
    var key = undefined;
  }

  if (dashview == undefined)
      dashview = document.querySelector('cz-dashview');
  
  if (dashview)
    dashview.addDash(dash, key);
}

function getTotalColumns() {
  if (cardview == undefined)
    cardview = document.querySelector('cz-cardview');
  if (dashview == undefined)
    dashview = document.querySelector('cz-dashview');
  var columns = 0;
  if (cardview)
    columns += Number(cardview.columns);
  if (dashview)
    columns += Number(dashview.columns);
  return columns;
}
