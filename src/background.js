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

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(showNotification),
            contentType: "application/json",
            dataType: 'json',
            error: function (response) {
                const result = requestToObject(showNotification, response);
                results.push(result);
            },
            success: function (response) {
                const result = requestToObject(showNotification, response);
                results.push(result);
            }
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

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(open),
            contentType: "application/json",
            dataType: 'json',
            error: function (response) {
                const result = requestToObject(open, response);
                results.push(result);
                console.log(results);
                sendResponse(results);
            },
            success: function (response) {
                const result = requestToObject(open, response);
                results.push(result);
                console.log(results);
                sendResponse(results);
            }
        });

        // the jquery ajax call is async
        // in order to send the result to the content script *after* the async work
        // we must return true here
        return true;
    }
)
