if (!localStorage['ip']) {
     localStorage['ip'] = '192.168.1.3';
}
if (!localStorage['port']) {
     localStorage['port'] = '80';
}
if (!localStorage['enabled']) {
     localStorage['enabled'] = 'true';
}

var ip = localStorage['ip'];
var port = localStorage['port'];
var enabled = localStorage['enabled'];


document.getElementById('ip').value = ip;
document.getElementById('port').value = port;
if (enabled == 'true') {
     document.getElementById('enabled').checked = true;
}

document.getElementById("btnSubmit").addEventListener("click", function () {
     localStorage['ip'] = document.getElementById('ip').value;
     localStorage['port'] = document.getElementById('port').value;
     if (document.getElementById('enabled').checked == true) {
          localStorage['enabled'] = 'true';
     } else {
          localStorage['enabled'] = 'false';
     }
     chrome.runtime.sendMessage({ task: 'save' });
});