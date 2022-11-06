if (!localStorage['ip']) {
    localStorage['ip'] = '192.168.1.3';
}
if (!localStorage['port']) {
    localStorage['port'] = '80';
}
if (!localStorage['enabled']) {
    localStorage['enabled'] = 'true';
}

const ip = localStorage['ip'];
const port = localStorage['port'];
const enabled = localStorage['enabled'];


document.getElementById('ip').value = ip;
document.getElementById('port').value = port;
if (enabled == 'true') {
    document.getElementById('enabled').checked = true;
}

document.getElementById("btnSubmit").addEventListener("click", function () {
    localStorage['ip'] = document.getElementById('ip').value;
    localStorage['port'] = document.getElementById('port').value;
    localStorage['enabled'] = document.getElementById('enabled').checked
        ? 'true'
        : 'false';

    console.log("Sending request to save information.");

    chrome.runtime.sendMessage({ task: 'save' }, function (response) {
        console.log(`Received response of ${response.farewell}`);
    });
});