chrome.storage.local.get(['ip', 'port', 'enabled', 'user', 'password', 'notification', 'play', 'video']).then((result) => {
    if (result.ip) {
        document.getElementById('ip').value = result.ip;
    }

    if (result.port) {
        document.getElementById('port').value = result.port;
    }

    if (result.user) {
        document.getElementById('user').value = result.user;
    }

    if (result.password) {
        document.getElementById('password').value = result.password;
    }

    if (result.enabled == 'true') {
        document.getElementById('enabled').checked = true;
    }

    if (result.notification) {
        document.getElementById('notification').innerText = result.notification;
    }

    if (result.play) {
        document.getElementById('play').innerText = result.play;
    }

    if (result.video) {
        document.getElementById('videoId').innerText = result.video;
    }
});

document.getElementById('targetForm').onsubmit = function () {
    const ip = document.getElementById('ip').value;
    const port = document.getElementById('port').value;
    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    const enabled = document.getElementById('enabled').checked
        ? 'true'
        : 'false';

    chrome.storage.local.set({ ip: ip, port: port, user: user, password: password, enabled: enabled });

    chrome.runtime.sendMessage({ task: 'save', ip: ip, port: port, user: user, password: password, enabled: enabled });
};
