var url = document.URL;

console.log(`Sending url ${url}`);

chrome.runtime.sendMessage({ location: url }, function (response) {
    console.log(`Received response of ${response.farewell}`);
});
