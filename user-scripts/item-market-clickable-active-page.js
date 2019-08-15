// ==UserScript==
// @name         Item Market Clickable Active Page
// @namespace    https://arsonwarehouse.com
// @version      1.0
// @description  Makes the active page number (on the item market) clickable for easier refreshing
// @author       Sulsay [2173590]
// @match        https://www.torn.com/imarket.php
// @grant        GM_addStyle
// ==/UserScript==

// GM_addStyle(`
// .shop-market-page .pagination.with-clickable-active-link-script a.active {
//     cursor: pointer;
// }
// `);

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
    const paginations = marketPage.querySelectorAll('.pagination');
    for (let pagination of paginations) {
        const activePageAnchor = pagination.querySelector('a.active');
        const pageNumber = parseInt(activePageAnchor.getAttribute('page'), 10);
        activePageAnchor.href = getHref(pageNumber);

        activePageAnchor.addEventListener('click', () => {
            const from = window.location.href;
            const to = activePageAnchor.href;
            console.log('from',window.location.href);
            console.log('to--',activePageAnchor.href);
            if (from === to) {
                window.location.reload();
            } else {
                window.location = activePageAnchor.href;
            }
        });
    }
}

function getHref(pageNumber) {
    // todo item id
    // todo for page 1 switch between start and no start param
    return '#/p=shop&type=36&start=' + ((pageNumber - 1) * 20);
}