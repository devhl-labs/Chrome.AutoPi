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

var ip;
var port;
var enabled;
var debug = true; 

function config(){
     if(!localStorage['ip']) localStorage['ip'] = '192.168.1.3';
     if(!localStorage['port']) localStorage['port'] = '80';
     if(!localStorage['enabled']) localStorage['enabled'] ='true';

     ip = localStorage['ip'];
     port = localStorage['port'];
     enabled = localStorage['enabled'];
}

config();

chrome.runtime.onMessage.addListener(
     function(request, sender, sendResponse) {
          
          if(request.task == 'save'){        
               config();
               console.log('variables have been figured again.');
               return;
          }
          
          if(enabled == 'false') return;
          
          try{
               var videoId = GetVideoId(request.location);
               if(videoId.length == 0) return;
               
               
               //create message on chrome
               var messageId = '';
               var opt = {
                    type: 'list',
                    title: 'AutoPi',
                    message: 'Primary message to display',
                    priority: 1,
                    items: [{ title: 'Playing:  ', message: videoId}],
                    iconUrl:'APi128NoGradient.png'
                };
               chrome.notifications.create('', opt, function(id) {messageId = id;})                          
                    
               //send message to xbmc
               var address = 'http://' + ip + ':' + port + '/jsonrpc?request={"jsonrpc":"2.0","method":"GUI.ShowNotification","params":{"title":"AutoPi","message":"Playing: ' + videoId + '", "displaytime":15000},"id":1}'
               $.ajax(address);

               //send url to xbmc
               opt = {
                    type: 'list',
                    title: 'AutoPi',
                    message: 'Primary message to display',
                    priority: 1,
                    items: [{ title: 'Error:  ', message: 'See background page for details.'}],
                    iconUrl:'APi128NoGradient.jpg'
                };
               var rpc = encodeURIComponent('{"jsonrpc":"2.0","id":1,"method":"Player.Open","params":{"item":{"file":"plugin://plugin.video.youtube/?path=/root/video&action=play_video&videoid=' + videoId + '"}}}');
               rpc = 'http://' + ip + ':' + port + '/jsonrpc?request=' + rpc;
               $.ajax({
                    url: rpc, 
                    error: function(data){
                         console.log(data);
                         console.log('http://' + ip + ':' + port + '/jsonrpc?request=');
                         console.log(encodeURIComponent('{"jsonrpc":"2.0","id":1,"method":"Player.Open","params":{"item":{"file":"plugin://plugin.video.youtube/?path=/root/video&action=play_video&videoid=' + videoId + '"}}}'));
                         chrome.notifications.create('', opt, function(id) {})
                    }, 
                    success: function(data){
                         console.log(data);
                         chrome.notifications.clear(messageId, function(){});
                    }
               });
          }          
          catch(e){
              console.log(e)
          }
     }
    
)		
     
function GetVideoId(url){
     var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
     var match = url.match(regExp);
     if (match && match[2].length == 11) {
       return match[2];
       console.log( match[2]);
     } else {
       return ""
       console.log('null');
     }    
}