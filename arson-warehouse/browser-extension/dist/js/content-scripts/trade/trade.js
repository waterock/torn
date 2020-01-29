global.tradeValueModalVue = null;

(async function () {
    if (window.location.search.indexOf('money=') > -1) {
        const moneyMatch = window.location.search.match(/money=(\d+)/);
        if (! Array.isArray(moneyMatch)) {
            return;
        }

        const money = parseInt(moneyMatch[1], 10);
        const moneyInput = await truthy(() => document.querySelector('input.input-money'));
        moneyInput.value = money;
        moneyInput.focus();
    }
})();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'get-trade-data') {
        const tradeModalVueRoot = document.createElement('div');
        tradeModalVueRoot.className = 'awh-trade-modal-vue-root';
        tradeModalVueRoot.setAttribute('v-cloak', '');
        tradeModalVueRoot.innerHTML = '<trade-modal @close="closeTradeModal" :trade-value-response="tradeValueResponse"></trade-modal>';
        document.body.appendChild(tradeModalVueRoot);

        global.tradeValueModalVue = new global.Vue({
            el: tradeModalVueRoot,
            data() {
                return {
                    tradeValueResponse: null,
                };
            },
            created() {
                document.documentElement.classList.add('awh-modal-is-open');
            },
            methods: {
                closeTradeModal() {
                    global.tradeValueModalVue = null;
                    document.documentElement.classList.remove('awh-modal-is-open');
                    this.$el.remove();
                    this.$destroy();
                },
            },
        });

        return browserAgnosticResponse(getTradeData(), sendResponse);
    }

    if (message.action === 'did-get-trade-value-response' && global.tradeValueModalVue !== null) {
        global.tradeValueModalVue.tradeValueResponse = message.payload;
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
        action: 'did-get-trade-data-with-listener',
        payload: tradeData,
    });

    return tradeData;
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
