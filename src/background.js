function setTarget() {
    ip = localStorage['ip'] ?? '';
    port = localStorage['port'] ?? '';
    enabled = localStorage['enabled'] ?? 'true';
    user = localStorage['user'] ?? '';
    password = localStorage["password"] ?? '';
}

let ip;
let port;
let enabled;
let lastPlayedVideoId;
setTarget();

let results = [];

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);

        if (request.task === 'save') {
            setTarget();
            console.log("The target has been updated.");
            sendResponse("The target has been updated.");
            return;
        }

        if (request.task === 'lastRequest') {
            sendResponse({ "videoId": lastPlayedVideoId, "requests": results });
            return;
        }

        if (enabled === 'false') {
            console.log("AutoPi is disabled, not playing the video.");
            sendResponse("AutoPi is disabled, not playing the video.");
            return;
        }

        if (!ip || !port) {
            console.log("AutoPi could not send the request because the ip address and port were not provided.");
            sendResponse("AutoPi could not send the request because the ip address and port were not provided.");
            return;
        }

        lastPlayedVideoId = request.play;

        const showNotification = {
            "jsonrpc": "2.0",
            "method": "GUI.ShowNotification",
            "params": {
                "title": "AutoPi",
                "message": `Playing: ${request.play}`,
                "displaytime": 15000
            },
            "id": 1
        };

        const url = `http://${ip}:${port}/jsonrpc`;

        results = []

        const headers = {'content-type': 'application/json' }

        const authorization = user && password ? btoa(`${user}:${password}`) : "";

        if (authorization) {
            headers["Authorization"] = `Basic ${authorization}`
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(showNotification),
            headers: headers
        })
        .then(function (response) {
            results.push(response.status)
        })

        const open = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "Player.Open",
            "params": {
                "item": {
                    "file": `plugin://plugin.video.youtube/?path=/root/video&action=play_video&videoid=${request.play}`
                }
            }
        };

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(open),
            headers: headers
        })
        .then(function (response) {
            results.push(response.status)
        })

        // we must return true here to send the result to the content script *after* the async work
        return true;
    }
)
