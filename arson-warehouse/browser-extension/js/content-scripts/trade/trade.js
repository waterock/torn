let tradeValueModal = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'get-trade-data') {
        tradeValueModal = openNewTradeValueModal();
        return browserAgnosticResponse(getTradeData(), sendResponse);
    }

    if (message.action === 'did-calculate-trade-value') {
        const {trade_value_modal_css, modal_body_html} = message.payload;
        injectCSS(trade_value_modal_css);
        tradeValueModal.setBodyHtml(modal_body_html);
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

    chrome.runtime.sendMessage({
        action: 'did-get-trade-data-for-yandex',
        payload: tradeData,
    });

    return tradeData;
}

function injectCSS(css) {
    if (document.head.querySelector('.trade-value-modal-styles') !== null) {
        return;
    }
    const styleElement = document.createElement('style');
    styleElement.className = 'trade-value-modal-styles';
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
}

function openNewTradeValueModal() {
    if (tradeValueModal !== null) {
        tradeValueModal.close();
    }

    const newTradeValueModal = new TradeValueModal();
    newTradeValueModal.open();

    return newTradeValueModal;
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
