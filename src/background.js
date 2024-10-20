let ip;
let port;
let enabled;
let user;
let password;

chrome.storage.local.get(["ip", "port", "enabled", "user", "password"]).then((result) => {
    ip = result.ip ?? '';
    port = result.port ?? '';
    user = result.user ?? '';
    enabled = result.enabled ?? 'true';
    password = result.password ?? '';
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);

        if (request.task === 'save') {
            ip = request.ip;
            port = request.port;
            enabled = request.enabled;
            user = request.user;
            password = request.password;
            console.log("The target has been updated.");
            return;
        }

        if (enabled === 'false') {
            console.log("AutoPi is disabled, not playing the video.");
            return;
        }

        if (!ip || !port) {
            console.log("AutoPi could not send the request because the ip address and port were not provided.");
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
            console.log(response);
            chrome.storage.local.set({ notification: response.status });
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
            console.log(response);
            chrome.storage.local.set({ play: response.status, video: request.play });
        })

        // we must return true here to send the result to the content script *after* the async work
        return true;
    }
)
