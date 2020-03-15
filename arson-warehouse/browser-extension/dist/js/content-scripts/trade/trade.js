global.tradeValueModalVueInstance = null;

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

chrome.runtime.onMessage.addListener((message) => {
    switch (message.action) {
        case 'check-is-modal-already-open':
            onCheckIsModalAlreadyOpen();
            break;
        case 'get-trade-data':
            onGetTradeData();
            break;
        case 'did-get-trade-value-response':
            if (global.tradeValueModalVueInstance !== null) {
                onDidGetTradeValueResponse(message.payload);
            }
            break;
    }
});

function onCheckIsModalAlreadyOpen() {
    chrome.runtime.sendMessage({
        action: 'did-check-is-modal-already-open',
        payload: document.documentElement.classList.contains('awh-modal-is-open'),
    });
}

function onGetTradeData() {
    global.tradeValueModalVueInstance = createTradeModalVueInstance();

    getTradeData().then((tradeData) => {
        chrome.runtime.sendMessage({
            action: 'did-get-trade-data',
            payload: tradeData,
        });
    });
}

function createTradeModalVueInstance() {
    const tradeModalVueRoot = createTradeModalVueRoot();
    document.body.appendChild(tradeModalVueRoot);

    return new global.Vue({
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
                global.tradeValueModalVueInstance = null;
                document.documentElement.classList.remove('awh-modal-is-open');
                this.$el.remove();
                this.$destroy();
            },
        },
    });
}

function createTradeModalVueRoot() {
    const tradeModalVueRoot = document.createElement('div');
    tradeModalVueRoot.className = 'awh-trade-modal-vue-root';
    tradeModalVueRoot.setAttribute('v-cloak', '');
    tradeModalVueRoot.innerHTML = '<trade-modal @close="closeTradeModal" :trade-value-response="tradeValueResponse"></trade-modal>';
    return tradeModalVueRoot;
}

function onDidGetTradeValueResponse(tradeValueResponse) {
    global.tradeValueModalVueInstance.tradeValueResponse = tradeValueResponse;
}

async function getTradeData() {
    const tradeWindow = await truthy(() => document.querySelector('.trade-cont'));

    const currentUserSide = new TradeSide(tradeWindow.querySelector('.trade-cont .user.left'));
    const otherUserSide = new TradeSide(tradeWindow.querySelector('.trade-cont .user.right'));

    return {
        currentUserId: getUserIdFromCookie(),
        currentUserItems: currentUserSide.getItems().map(item => item.getApiRequestData()),
        otherUserName: otherUserSide.getUserName(),
        otherUserItems: otherUserSide.getItems().map(item => item.getApiRequestData()),
    };
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

function getUserIdFromCookie() {
    const userIdString = document.cookie.split(';')
        .map(entry => entry.trim())
        .find(entry => entry.indexOf('uid=') === 0)
        .replace('uid=', '');

    return parseInt(userIdString, 10);
}
