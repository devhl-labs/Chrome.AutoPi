function addLocationObserver(callback) {
    const config = {
        childList: true,
        subtree: true
    }

    const observer = new MutationObserver(callback)
    observer.observe(document, config)
}

function observerCallback() {
    const tempVideoId = getVideoId(document.URL);
    if (videoId != tempVideoId && window.location.href.includes('youtube')) {
        videoId = tempVideoId;
        sendRequestToPlayVideo(videoId);
    }
}

function sendRequestToPlayVideo(videoId) {
    console.log(`Requesting to play ${videoId}`);
    chrome.runtime.sendMessage({ location: document.URL }, function (response) {
        console.log(`Received response of ${response.farewell}`);
    });
}

let videoId = getVideoId(document.URL);
addLocationObserver(observerCallback);
sendRequestToPlayVideo(videoId);
