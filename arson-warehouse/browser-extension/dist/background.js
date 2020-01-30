window.dev = false;
chrome.management.getSelf((extensionInfo) => {
    window.dev = extensionInfo.installType === 'development';
});

window.userAgentNeedsListener = isUserAgent("YaBrowser") || isUserAgent("Mobile Safari");

function isUserAgent(search) {
    return navigator.userAgent.indexOf(search) > -1;
}

chrome.browserAction.onClicked.addListener(async (tab) => {
    if (tab.url.indexOf('trade.php') === -1) {
        showAlertInTab(tab, 'ArsonWarehouse shows you the total value for a trade.\n\nView a trade and then press this button.');
        return;
    }

    try {
        const tradeId = +tab.url.match(/ID=(\d+)/)[1];
        const tradeDataFromPage = await getTradeDataFromPage(tab);
        const tradeValueResponse = await fetchTradeValue(tradeId, tradeDataFromPage);
        emitTradeValueResponse(tab, tradeValueResponse);
    } catch (error) {
        emitTradeValueResponse(tab, {error: error.hasFriendlyMessage ? error.message : 'Failed to get trade value.'});
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'received-equipment-report') {
        sendEquipmentReportToArsonWarehouse(message.payload);
    }
});

function sendEquipmentReportToArsonWarehouse(report) {
    return fetch(getBaseUrl() + '/api/v1/equipment-reports', {
        headers: new Headers({
            Authorization: 'Basic ' + btoa(`${report.reporterId}:`),
        }),
        method: 'post',
        body: JSON.stringify(report.equipment),
    });
}

function getTradeDataFromPage(tab) {
    if (window.userAgentNeedsListener) {
        return getTradeDataWithListener(tab);
    }

    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id, {action: 'get-trade-data'}, resolve);
    });
}

function getTradeDataWithListener(tab) {
    return new Promise((resolve) => {
        const oneTimeResponseHandler = (message) => {
            if (message.action === 'did-get-trade-data-with-listener') {
                resolve(message.payload);
            }
            chrome.runtime.onMessage.removeListener(oneTimeResponseHandler);
        };
        chrome.runtime.onMessage.addListener(oneTimeResponseHandler);
        chrome.tabs.sendMessage(tab.id, {action: 'get-trade-data'});
    });
}

function fetchTradeValue(tradeId, tradeData) {
    if (tradeData.currentUserItems.length + tradeData.otherUserItems.length === 0) {
        throw createErrorWithFriendlyMessage('Neither side contains items.');
    }
    if (tradeData.currentUserItems.length > 0 && tradeData.otherUserItems.length > 0) {
        throw createErrorWithFriendlyMessage('Both sides contain items - this is not supported.');
    }

    const requestBody = getRequestBody(tradeId, tradeData);

    return fetch(getBaseUrl() + '/api/v1/trades', {method: 'post', body: JSON.stringify(requestBody)}).then(async (response) => {
        if (response.status === 200) {
            return response.json()
        }
        if (response.status === 400) {
            const responseJson = await response.json();
            if (typeof responseJson.reason === 'string' && responseJson.reason.length > 0) {
                throw createErrorWithFriendlyMessage(responseJson.reason);
            }
        }
        throw createErrorWithFriendlyMessage('Something went wrong on the ArsonWarehouse server (or the service is temporarily down).');
    });
}

function emitTradeValueResponse(tab, tradeValueResponse) {
    chrome.tabs.sendMessage(tab.id, {
        action: 'did-get-trade-value-response',
        payload: tradeValueResponse,
    });
}

function getRequestBody(tradeId, tradeData) {
    const requestBody = {
        trade_id: tradeId,
        plugin_version: chrome.runtime.getManifest().version,
    };

    const currentUserIsBuyer = tradeData.currentUserItems.length === 0 && tradeData.otherUserItems.length > 0;
    if (currentUserIsBuyer) {
        requestBody.buyer = tradeData.currentUserId;
        requestBody.seller = tradeData.otherUserName;
        requestBody.items = tradeData.otherUserItems;
    } else {
        requestBody.buyer = tradeData.otherUserName;
        requestBody.seller = tradeData.currentUserId;
        requestBody.items = tradeData.currentUserItems;
    }

    return requestBody;
}

function showAlertInTab(tab, message) {
    chrome.tabs.executeScript(tab.id, {
        code: 'alert(' + JSON.stringify(message) + ');'
    });
}

function createErrorWithFriendlyMessage(message) {
    const error = new Error(message);
    error.hasFriendlyMessage = true;
    return error;
}

function getBaseUrl() {
    return window.dev ? 'http://arsonwarehouse.loc' : 'https://arsonwarehouse.com';
}