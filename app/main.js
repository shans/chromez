chrome.power.requestKeepAwake("display");

onkeydown = e => {
console.log(e);
  if (e.code == 'Escape')
    webview.src = 'http://chromez-app.appspot.com'
  if (e.keyCode == 116) {
    chrome.runtime.restart(); // For kiosk mode.
    chrome.runtime.reload(); // For non-kiosk mode.
  }
}

new MutationObserver(mutations => mutations.forEach(mutation => {
  if (mutation.type == 'attributes' && mutation.attributeName == 'src')
    chrome.storage.local.set({'src': webview.src});
})).observe(webview, {attributes: true});

chrome.storage.local.get('src', result => webview.src = result.src);
