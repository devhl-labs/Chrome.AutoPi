function addLocationObserver(callback) {
    const config = {
        childList: true,
        subtree: true
    }

    const observer = new MutationObserver(callback)
    observer.observe(document, config)
}

function observerCallback() {
    const tempVideoId = getVideoId();
    if (tempVideoId && videoId != tempVideoId) {
        videoId = tempVideoId;
        sendRequestToPlayVideo(videoId);
    }
}

function sendRequestToPlayVideo(videoId) {
    console.log(`Requesting to play ${videoId}`);
    chrome.runtime.sendMessage({ play: videoId }, function (response) {
        console.log(`Received response of ${response.farewell}`);
    });
}

function getVideoId() {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = document.URL.match(regExp);

    return match && match[2].length === 11
        ? match[2]
        : undefined
}

let videoId = getVideoId(document.URL);
addLocationObserver(observerCallback);
sendRequestToPlayVideo(videoId);
