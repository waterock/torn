chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'get-trade-data') {
        return browserAgnosticResponse(getTradeData(), sendResponse);
    }

    if (message.action === 'did-calculate-trade-value') {
        const trade = message.payload;

        const tradeValueModal = new TradeValueModal();
        tradeValueModal.open();
        tradeValueModal.setBodyHtml(getTradeValueModalBodyHtml(trade));
    }
});

async function getTradeData() {
    const tradeWindow = await truthy(() => document.querySelector('.trade-cont'));

    const currentUserSide = new TradeSide(tradeWindow.querySelector('.trade-cont .user.left'));
    const otherUserSide = new TradeSide(tradeWindow.querySelector('.trade-cont .user.right'));

    const tradeData = {
        currentUserId: getUserIdFromCookie(),
        currentUserItems: currentUserSide.getItems().map(item => item.getApiRequestData()),
        otherUserName: otherUserSide.getUserName(),
        otherUserItems: otherUserSide.getItems().map(item => item.getApiRequestData()),
    };

    return tradeData;
}

function getTradeValueModalBodyHtml(trade) {
    let html = '';
    for (let component of trade.components) {
        html += `${component.name}: ${formatCurrency(component.unit_price)} x ${component.quantity} = ${formatCurrency(component.total_price)} <span style="color:white">|</span><br>`;
    }
    html += '<hr>';
    html += `Total: <strong>${formatCurrency(trade.total_price)}</strong><br>`;

    if (Array.isArray(trade.warnings) && trade.warnings.length > 0) {
        html += '<br>';
        html += 'Warnings:<br>';
        for (let warning of trade.warnings) {
            html += `${warning}<br>`;
        }
    }

    if (trade.receipt_url) {
        html += '<div class="receipt-url"><a href="' + trade.receipt_url + '" target="_blank" rel="noopener noreferrer">' + trade.receipt_url + '</a></div>';
    }

    return html;
}

function truthy(handler) {
    return new Promise(resolve => {
        const resolveIfHandlerReturnsTruthy = () => {
            let result = handler();
            if (result) {
                resolve(result);
            } else {
                setTimeout(resolveIfHandlerReturnsTruthy, 100);
            }
        };
        resolveIfHandlerReturnsTruthy();
    });
}

function browserAgnosticResponse(promise, sendResponse) {
    // For chrome, invoke sendResponse when the promise resolves:
    promise.then(sendResponse);

    // For firefox, return the promise:
    return promise;
}

function getUserIdFromCookie() {
    const userIdString = document.cookie.split(';')
        .map(entry => entry.trim())
        .find(entry => entry.indexOf('uid=') === 0)
        .replace('uid=', '');

    return parseInt(userIdString, 10);
}

function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US');
}
