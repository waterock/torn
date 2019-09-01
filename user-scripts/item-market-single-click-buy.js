// ==UserScript==
// @name         Item Market Single Click Buy
// @namespace    https://arsonwarehouse.com
// @version      1.0
// @description  ...
// @author       Sulsay [2173590]
// @match        https://www.torn.com/imarket.php
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

GM_addStyle(`
.shop-market-page ul.items > li {
    position: relative;
}
.shop-market-page li.buy.with-single-click-buy-button-script {
    position: relative;
}
.single-click-buy-button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.single-click-buy-button:hover .single-click-buy-button-icon {
    background-position: 0 -14px;
}
.single-click-buy-button:hover .single-click-buy-button-marker {
    color: #B53471;
}
.single-click-buy-button-icon {
    position: relative;
    background: url('https://www.torn.com/images/v2/items/item_market/buy.png');
    width: 14px;
    height: 14px;
    display: block;
    line-height: 1;
}
.single-click-buy-button-marker {
    position: absolute;
    left: -5px;
    color: #999;
}
.item-list-item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fffa;
}
.single-click-buy-item-status {
    font-weight: bold;
    text-align: right;
    padding-right: .7rem;
    line-height: 2.3rem;
}
`);

(async function() {
    new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === window.Node.ELEMENT_NODE && addedNode.classList.contains('shop-market-page')) {
                    marketPageDidLoad(addedNode);
                }
            }
        }
    }).observe(document.getElementById('item-market-main-wrap'), {childList: true});
})();

function marketPageDidLoad(marketPage) {
    const buyLinkSpans = Array.from(marketPage.querySelectorAll('span.buy-link'));
    buyLinkSpans.forEach(replaceWithSingleClickBuyButton);
}

function replaceWithSingleClickBuyButton(buyLinkSpan) {
    const buyListItem = buyLinkSpan.closest('li.buy');
    buyListItem.classList.add('with-single-click-buy-button-script');

    const itemListItem = getClosestItemListItem(buyListItem);
    itemListItem.dataset.marketListingId = buyLinkSpan.dataset.id;

    removeAllChildren(buyListItem);
    const singleClickBuyButton = createSingleClickBuyButton();
    buyListItem.insertBefore(singleClickBuyButton, null);

    singleClickBuyButton.addEventListener('click', () => buyItem(itemListItem));
}

function buyItem(itemListItem) {
    const buyStatusDiv = createItemBuyStatusOverlay(itemListItem);
    buyStatusDiv.innerText = 'Buying...';

    GM_xmlhttpRequest({
        method: 'POST',
        url: `/imarket.php?rfcv=${getRfcvFromCookie()}`,
        data: `step=buyItemConfirm&ID=${itemListItem.dataset.marketListingId}&item=0`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        onload: (response) => {
            //
        },
        onerror: (error) => {
            //
        }
    });
}

function createItemBuyStatusOverlay(itemListItem) {
    const overlay = document.createElement('div');
    overlay.className = 'item-list-item-overlay';
    itemListItem.insertBefore(overlay, null);

    const buyStatusDiv = document.createElement('div');
    buyStatusDiv.className = 'single-click-buy-item-status';
    overlay.insertBefore(buyStatusDiv, null);

    return buyStatusDiv;
}

function getClosestItemListItem(element) {
    while (! element.parentElement.matches('ul.items')) {
        element = element.parentElement;
    }
    return element;
}

function createSingleClickBuyButton() {
    const singleClickBuyButton = document.createElement('a');
    singleClickBuyButton.href = '#';
    singleClickBuyButton.className = 'single-click-buy-button';
    singleClickBuyButton.innerHTML = '<span class="single-click-buy-button-icon"><span class="single-click-buy-button-marker">&raquo;</span></span>';
    return singleClickBuyButton;
}

function getRfcvFromCookie() {
    const rfcvCookie = document.cookie.split(';').find(pair => pair.trim().indexOf('rfc_v=') === 0);
    if (rfcvCookie !== undefined) {
        return rfcvCookie.split('=')[1].trim();
    }
    return 'undefined';
}

function removeAllChildren(element) {
    let child;
    while ((child = element.firstElementChild) !== null) {
        element.removeChild(child);
    }
}