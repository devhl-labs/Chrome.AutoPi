const ip = localStorage['ip'];
const port = localStorage['port'];
const enabled = localStorage['enabled'];

document.getElementById('ip').value = ip;
document.getElementById('port').value = port;
if (enabled == 'true') {
    document.getElementById('enabled').checked = true;
}

document.getElementById("targetForm").onsubmit = function () {
    localStorage['ip'] = document.getElementById('ip').value;
    localStorage['port'] = document.getElementById('port').value;
    localStorage['enabled'] = document.getElementById('enabled').checked
        ? 'true'
        : 'false';

    console.log("Sending request to save information.");

    chrome.runtime.sendMessage({ task: 'save' }, function (task) {
        console.log(task);
    });
};

window.addEventListener('click', function (e) {
    if (e.target.href !== undefined) {
        chrome.tabs.create({ url: e.target.href })
    }
})

chrome.runtime.sendMessage({ task: 'lastOperation' }, function (lastOperation) {
    document.getElementById("videoId").innerText = lastOperation.videoId;
    if (lastOperation.requests.length > 0){
        document.getElementById("notification").innerText = lastOperation.requests[0].response.result;
        document.getElementById("play").innerText = lastOperation.requests[1].response.result;
    }
});