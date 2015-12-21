setInterval(() => {
  var a = new Date();
  if (a.getDay() < 6 && a.getHours() > 6 && a.getHours() < 20) {
    chrome.power.requestKeepAwake("display");
  } else {
    chrome.power.releaseKeepAwake();
  }
}, 60 * 1000);
