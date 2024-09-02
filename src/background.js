// background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'PAGE_INFO') {
        chrome.storage.local.set({lastPageInfo: request.data});
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, {type: 'PAGE_LOADED'});
    }
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        chrome.storage.sync.set({userConsent: false});
    }
    });
    
});