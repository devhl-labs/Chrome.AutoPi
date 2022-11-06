function setTarget() {
    ip = localStorage['ip'] ?? '192.168.1.3';
    port = localStorage['port'] ?? '80';
    enabled = localStorage['enabled'] ?? 'true';
}

function requestToObject(request, response) {
    return {
        request: request,
        response: response
    };
}

let ip;
let port;
let enabled;
setTarget();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(JSON.stringify(request));

        if (request.task === 'save') {
            setTarget();
            console.log("The target has been updated.");
            sendResponse("The target has been updated.");
            return;
        }

        if (enabled === 'false') {
            console.log("AutoPi is disabled, not playing the video.");
            sendResponse("AutoPi is disabled, not playing the video.");
            return;
        }

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

        const results = []

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(showNotification),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(responseBodyJson) {
                const result = requestToObject(showNotification, responseBodyJson);
                results.push(result);
            });

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
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(responseBodyJson) {
                const result = requestToObject(open, responseBodyJson);
                results.push(result);
                console.log(results);
                sendResponse(results);
            });

        // we must return true here to send the result to the content script *after* the async work
        return true;
    }
)
