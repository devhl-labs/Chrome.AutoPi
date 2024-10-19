const ip = localStorage['ip'];
const port = localStorage['port'];
const enabled = localStorage['enabled'];
const user = localStorage['user'];
const password = localStorage['password'];

if (ip) {
    document.getElementById('ip').value = ip;
}

if (port) {
    document.getElementById('port').value = port;
}

if (user) {
    document.getElementById('user').value = user;
}

if (password) {
    document.getElementById('password').value = password;
}

if (enabled == 'true') {
    document.getElementById('enabled').checked = true;
}

document.getElementById('targetForm').onsubmit = function () {
    localStorage['ip'] = document.getElementById('ip').value;
    localStorage['port'] = document.getElementById('port').value;
    localStorage['user'] = document.getElementById('user').value;
    localStorage['password'] = document.getElementById('password').value;
    localStorage['enabled'] = document.getElementById('enabled').checked
        ? 'true'
        : 'false';

    console.log('Sending request to save information.');

    chrome.runtime.sendMessage({ task: 'save' }, function (response) {
        console.log(response);
    });
};

window.addEventListener('click', function (e) {
    if (e.target.href !== undefined) {
        chrome.tabs.create({ url: e.target.href })
    }
})

chrome.runtime.sendMessage({ task: 'lastRequest' }, function (lastRequest) {
    document.getElementById('videoId').innerText = lastRequest.videoId;
    if (lastRequest.requests.length > 0) {
        document.getElementById('notification').innerText = lastRequest.requests[0]
        document.getElementById('play').innerText = lastRequest.requests[1]
    }
});
