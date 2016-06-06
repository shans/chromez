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

  var e = elementAfter.parentElement.querySelector(dash);
  if (e && e.key == key)
    return;
  Polymer.Base.importHref(dash + '.html',
    function(e) {
      var elt = document.createElement(dash);
      elt.key = key;
      elementAfter.parentElement.insertBefore(elt, elementAfter);
    },
    function(e) {
      console.error("couldn't create dash " + dash);
    });
}
