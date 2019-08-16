const userAgentIsYandex = navigator.userAgent.indexOf('YaBrowser') > -1;

chrome.browserAction.onClicked.addListener(async (tab) => {
    if (tab.url.indexOf('trade.php') === -1) {
        showAlertInTab(tab, 'ArsonWarehouse shows you the total value for a trade.\n\nView a trade and then press this button.');
        return;
    }

    try {
        const tradeData = await getTradeData(tab);
        const tradeValue = await fetchTradeValue(tradeData);
        emitTradeValue(tab, tradeValue);
    } catch (error) {
        showAlertInTab(tab, error.hasFriendlyMessage ? error.message : 'Failed to get trade value.');
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'received-equipment-report') {
        console.log('got equipment report:', message.payload);
    }
});

function getTradeData(tab) {
    if (userAgentIsYandex) {
        return getTradeDataForYandex(tab);
    }

    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id, {action: 'get-trade-data'}, resolve);
    });
}

function getTradeDataForYandex(tab) {
    return new Promise((resolve) => {
        const oneTimeResponseHandler = (message) => {
            if (message.action === 'did-get-trade-data-for-yandex') {
                resolve(message.payload);
            }
            chrome.runtime.onMessage.removeListener(oneTimeResponseHandler);
        };
        chrome.runtime.onMessage.addListener(oneTimeResponseHandler);
        chrome.tabs.sendMessage(tab.id, {action: 'get-trade-data'});
    });
}

function fetchTradeValue(tradeData) {
    if (tradeData.currentUserItems.length + tradeData.otherUserItems.length === 0) {
        throw createErrorWithFriendlyMessage('Neither side contains items.');
    }
    if (tradeData.currentUserItems.length > 0 && tradeData.otherUserItems.length > 0) {
        throw createErrorWithFriendlyMessage('Both sides contain items - this is not supported.');
    }

    const requestBody = getRequestBody(tradeData);

    return fetch('https://arsonwarehouse.com/api/v1/trade-value', {method: 'post', body: JSON.stringify(requestBody)}).then(response => {
        if (response.status === 200) {
            return response.json()
        }
        throw createErrorWithFriendlyMessage('Something went wrong on the ArsonWarehouse server (or the service is temporarily down).');
    });
}

function emitTradeValue(tab, tradeValue) {
    chrome.tabs.sendMessage(tab.id, {
        action: 'did-calculate-trade-value',
        payload: tradeValue,
    });
}

function getRequestBody(tradeData) {
    const requestBody = {
        plugin_version: chrome.runtime.getManifest().version,
    };

    const currentUserIsBuyer = tradeData.currentUserItems.length === 0 && tradeData.otherUserItems.length > 0;
    if (currentUserIsBuyer) {
        requestBody.buyer = tradeData.currentUserId;
        requestBody.items = tradeData.otherUserItems;
    } else {
        requestBody.buyer = tradeData.otherUserName;
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
