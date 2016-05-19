chrome.power.requestKeepAwake("display");

window.addEventListener('keydown', event => {
  // F5
  if (event.keyCode == 116) {
    webview.reload();
  }
});
