//////////////////////////*****************
//  http://<username>:<password>@<ip-addr>:<port>/jsonrpc?request={"jsonrpc":"2.0","method":"GUI.ShowNotification","params":{"title":"uTorrent","message":"show is ready"},"id":1}
//



//////////////////////////////////////////////////////////////////////////////////
//http://www.raspberrypi.org/forums/viewtopic.php?t=36912&p=406878

//http://yourxbmcipaddyhere/jsonrpc?request= + one of the following commands
//XBMC DOWN={"jsonrpc":"2.0","method":"Input.Down","id":1}
//XBMC RIGHT={"jsonrpc":"2.0","method":"Input.Right","id":1}
//XBMC SELECT={"jsonrpc":"2.0","method":"Input.Select","id":1}
//XBMC LEFT={"jsonrpc":"2.0","method":"Input.Left","id":1}
//XBMC INFO={"jsonrpc":"2.0","method":"Input.Info","id":1}
//XBMC HOME={"jsonrpc":"2.0","method":"Input.Home","id":1}
//XBMC UP={"jsonrpc":"2.0","method":"Input.Up","id":1}
//XBMC ContextMenu={"jsonrpc":"2.0","method":"Input.ContextMenu","id":1}
//XBMC 30SecForward={"jsonrpc":"2.0","id":1,"method":"Player.Seek","params":{"playerid":1,"value":"smallforward"}}
//XBMC 30SecBkwd={"jsonrpc":"2.0","id":1,"method":"Player.Seek","params":{"playerid":1,"value":"smallbackward"}}
//XBMC QUIT={"jsonrpc":"2.0","method":"Application.Quit","id":1}
//XBMC BACK={"jsonrpc":"2.0","method":"Input.Back","id":1}
//XBMC PLAYPAUSE {"jsonrpc":"2.0","method":"Player.PlayPause","params":{"playerid":1},"id":1}
//XBMC STOP={"jsonrpc":"2.0","method":"Player.Stop","params":{"playerid":1},"id":1}
//XBMC SUBTITLENEXT={"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":1,"subtitle":"next"}}
//XBMC SUBTITLEOFF={"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":1,"subtitle":"off"}}
//XBMC SUBTITLEON={"jsonrpc":"2.0","id":1,"method":"Player.SetSubtitle","params":{"playerid":1,"subtitle":"off"}}
//XBMC SHOWOSD={"jsonrpc":"2.0","method":"Input.ShowOSD","id":1}
//XBMC SETFULLSCREEN={"jsonrpc": "2.0", "method": "GUI.SetFullscreen", "params": { "fullscreen": "toggle" }, "id": "1"}
//XBMC MOVIESLIST={ "jsonrpc": "2.0", "method": "GUI.ActivateWindow", "params": { "window": "video", "parameters": [ "MovieTitles" ] }, "id": 1 }
//XBMC TVLIST={"jsonrpc": "2.0", "method": "GUI.ActivateWindow", "params": { "window": "video", "parameters": [ "TvShowTitles" ] }, "id": 1 } 
/////////////////////////////////////////////////////////////////////////////////////

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

        let videoId = GetVideoId(request.location);
        if (!videoId) {
            return;
        }

        console.log(`Player video id: ${videoId}`);

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
        let showNotification = {
            "jsonrpc": "2.0",
            "method": "GUI.ShowNotification",
            "params": {
                "title": "AutoPi",
                "message": `Playing: ${videoId}`,
                "displaytime": 15000
            },
            "id": 1
        };

        let url = 'http://' + ip + ':' + port + '/jsonrpc';

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

        let open = { 
            "jsonrpc": "2.0",
            "id": 1,
            "method": "Player.Open",
            "params": {
                "item": {
                    "file": `plugin://plugin.video.youtube/?path=/root/video&action=play_video&videoid=${videoId}`
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

function GetVideoId(url) {
    console.log(`The url is ${url}`);

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);

    return match && match[2].length === 11
        ? match[2]
        : undefined
}