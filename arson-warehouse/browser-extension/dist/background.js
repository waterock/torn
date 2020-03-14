window.dev = false;
chrome.management.getSelf((extensionInfo) => {
    window.dev = extensionInfo.installType === 'development';
});

window.messageHandlers = new Map();

chrome.runtime.onMessage.addListener((message) => {
    // This is a generic listener for messages from content-scripts. Use the Set window.messageHandlers to add handlers.
    for (let [action, handler] of window.messageHandlers.entries()) {
        if (message.action === action) {
            handler(message);
        }
    }
});

chrome.browserAction.onClicked.addListener(async (tab) => {
    if (tab.url.indexOf('trade.php') === -1) {
        showAlertInTab(tab, 'ArsonWarehouse shows you the total value for a trade.\n\nView a trade and then press this button.');
        return;
    }

    try {
        const tradeId = parseInt(tab.url.match(/ID=(\d+)/)[1], 10);
        const tradeDataFromPage = await getTradeDataFromPage(tab);
        const tradeValueResponse = await fetchTradeValue(tradeId, tradeDataFromPage);
        emitTradeValueResponse(tab, tradeValueResponse);
    } catch (error) {
        emitTradeValueResponse(tab, {error: error.hasFriendlyMessage ? error.message : 'Failed to get trade value.'});
    }
});

window.messageHandlers.set('received-equipment-report', (message) => sendEquipmentReportToArsonWarehouse(message.payload));

function getTradeDataFromPage(tab) {
    return new Promise((resolve) => {
        window.messageHandlers.set('did-get-trade-data', (message) => resolve(message.payload));
        chrome.tabs.sendMessage(tab.id, {action: 'get-trade-data'});
    });
}

async function fetchTradeValue(tradeId, tradeData) {
    if (tradeData.currentUserItems.length + tradeData.otherUserItems.length === 0) {
        throw errorWithFriendlyMessage('Neither side contains items.');
    }
    if (tradeData.currentUserItems.length > 0 && tradeData.otherUserItems.length > 0) {
        throw errorWithFriendlyMessage('Both sides contain items - this is not supported.');
    }

    try {
        const response = await fetch(getBaseUrl() + '/api/v1/trades', {
            method: 'post',
            body: JSON.stringify(getTradeRequestBody(tradeId, tradeData)),
        });

        if (response.status === 400) {
            const responseJson = await response.json();
            if (typeof responseJson.reason === 'string' && responseJson.reason.length > 0) {
                throw errorWithFriendlyMessage(responseJson.reason);
            }
        } else if (response.status !== 200) {
            throw errorWithFriendlyMessage('Something went wrong on the ArsonWarehouse server (or the service is temporarily down).');
        }

        return response.json();
    } catch (error) {
        throw errorWithFriendlyMessage(error.message + ' - Please make sure the plugin has permission to access arsonwarehouse.com.');
    }
}

function getTradeRequestBody(tradeId, tradeData) {
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

function emitTradeValueResponse(tab, tradeValueResponse) {
    chrome.tabs.sendMessage(tab.id, {
        action: 'did-get-trade-value-response',
        payload: tradeValueResponse,
    });
}

function sendEquipmentReportToArsonWarehouse(report) {
    return fetch(getBaseUrl() + '/api/v1/equipment-reports', {
        headers: new Headers({
            Authorization: 'Basic ' + btoa(`${report.reporterId}:`),
        }),
        method: 'post',
        body: JSON.stringify(report.equipment),
    });
}

function showAlertInTab(tab, message) {
    chrome.tabs.executeScript(tab.id, {
        code: 'alert(' + JSON.stringify(message) + ');'
    });
}

function errorWithFriendlyMessage(message) {
    const error = new Error(message);
    error.hasFriendlyMessage = true;
    return error;
}

function getBaseUrl() {
    return window.dev ? 'http://arsonwarehouse.loc' : 'https://arsonwarehouse.com';
}