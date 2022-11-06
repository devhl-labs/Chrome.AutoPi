var url = document.URL;

console.log(url);

chrome.runtime.sendMessage({ location: url }, function (response) {
  //console.log(response.farewell);
});
