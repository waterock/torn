browser.browserAction.onClicked.addListener(async (tab) => {
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

function getTradeData(tab) {
    return browser.tabs.sendMessage(tab.id, {
        action: 'get-trade-data',
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
    browser.tabs.sendMessage(tab.id, {
        action: 'did-calculate-trade-value',
        payload: tradeValue,
    });
}

function getRequestBody(tradeData) {
    const requestBody = {
        plugin_version: browser.runtime.getManifest().version,
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
    browser.tabs.executeScript(tab.id, {
        code: 'alert(' + JSON.stringify(message) + ');'
    });
}

function createErrorWithFriendlyMessage(message) {
    const error = new Error(message);
    error.hasFriendlyMessage = true;
    return error;
}
