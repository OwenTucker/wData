const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';
let creating; // A global promise to avoid concurrency issues

chrome.runtime.onMessage.addListener(handleMessages);

cchrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === 'request-geolocation') {
        try {
            const location = await getGeolocation();
            sendResponse({ success: true, location: location });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
        return true; // Indicate that you will send a response asynchronously
    }
});


async function getGeolocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation not supported"));
        }
    });
}


async function hasDocument() {
    // Check all windows controlled by the service worker to see if one
    // of them is the offscreen document with the given path
    const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
    const matchedClients = await clients.matchAll();

    return matchedClients.some(c => c.url === offscreenUrl)
}

async function setupOffscreenDocument(path) {
    //if we do not have a document, we are already setup and can skip
    if (!(await hasDocument())) {
        // create offscreen document
        if (creating) {
            await creating;
        } else {
            creating = chrome.offscreen.createDocument({
                url: path,
                reasons: [chrome.offscreen.Reason.GEOLOCATION || chrome.offscreen.Reason.DOM_SCRAPING],
                justification: 'add justification for geolocation use here',
            });

            await creating;
            creating = null;
        }
    }
}

async function closeOffscreenDocument() {
    if (!(await hasDocument())) {
        return;
    }
    await chrome.offscreen.closeDocument();
}