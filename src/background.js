let ip;
let port;
let enabled;

config();

function config() {
    if (!localStorage['ip']) {
        localStorage['ip'] = '192.168.1.3';
    }
    if (!localStorage['port']) {
        localStorage['port'] = '80';
    }
    if (!localStorage['enabled']) {
        localStorage['enabled'] = 'true';
    }

    ip = localStorage['ip'];
    port = localStorage['port'];
    enabled = localStorage['enabled'];
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(`Message recieved: ${JSON.stringify(request)}`);

        if (request.task === 'save') {
            config();
            console.log('variables have been updated');
            return;
        }

        if (enabled === 'false') {
            return;
        }

        //create message on chrome
        //let messageId = '';
        //let opt = {
        //    type: 'list',
        //    title: 'AutoPi',
        //    message: 'Playing Video',
        //    priority: 1,
        //    items: [{ title: 'Playing:  ', message: videoId}],
        //    iconUrl:'APi128NoGradient.png'
        //};

        //send message to xbmc
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

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(showNotification),
            contentType: "application/json",
            dataType: 'json',
            error: function (response) {
                console.log(showNotification);
                console.log(response);
            },
            success: function (response) {
                console.log(showNotification);
                console.log(response);
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
                console.log(open)
                console.log(response);
                //opt.message = 'Success';
                //chrome.notifications.create('', opt, function(id) {})
            },
            success: function (response) {
                console.log(open);
                console.log(response);
                //opt.message = 'Error!';
                //chrome.notifications.create('', opt, function (id) { })
            }
        });
    }
)
