// ==UserScript==
// @name         Item Market Clickable Active Page
// @namespace    https://arsonwarehouse.com
// @version      1.0
// @description  Makes the active page number (on the item market) clickable for easier refreshing
// @author       Sulsay [2173590]
// @match        https://www.torn.com/imarket.php
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle('.shop-market-page .pagination.with-clickable-active-link-script a.active {cursor: pointer;}');

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
    marketPage.querySelectorAll('.pagination').forEach(makeActivePageClickable);
}

function makeActivePageClickable(pagination) {
    pagination.classList.add('with-clickable-active-link-script');

    const activePageAnchor = pagination.querySelector('a.active');
    activePageAnchor.href = getHrefForPageNumber(parseInt(activePageAnchor.getAttribute('page'), 10));

    activePageAnchor.addEventListener('click', () => {
        if (window.location.href === activePageAnchor.href) {
            window.location.reload();
        } else {
            window.location = activePageAnchor.href;
        }
    });
}

function getHrefForPageNumber(pageNumber) {
    // todo item id

    const currentHashParams = window.location.hash.substr(2).split('&');
    const nextHashParamsInDefaultOrder = ['p=shop', 'type=36', `start=${(pageNumber - 1) * 20}`];

    const nextHashParams = paramsAreEqual(nextHashParamsInDefaultOrder, currentHashParams)
        ? swapLastTwoParams(nextHashParamsInDefaultOrder)
        : nextHashParamsInDefaultOrder;

    return '#/' + nextHashParams.join('&');
}

function paramsAreEqual(paramsA, paramsB) {
    return JSON.stringify(paramsA) === JSON.stringify(paramsB);
}

function swapLastTwoParams(allParams) {
    if (allParams.length < 2) {
        return [...allParams];
    }

    const copyOfHead = allParams.slice(0, -2);
    const reversedTail = allParams.slice(-2).reverse();

    return copyOfHead.concat(reversedTail);
}