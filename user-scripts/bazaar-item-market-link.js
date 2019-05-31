// ==UserScript==
// @name         Bazaar Item Market Link
// @namespace    https://github.com/sulsay/torn
// @version      1.0
// @description  Adds link "View in item market" on expanded items in bazaar
// @author       Sulsay [2173590]
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// ==/UserScript==

(async function () {
    const itemsList = await truthy(() => document.querySelector('.bazaar-main-wrap .items-list'));
    new MutationObserver(insertItemPageLinkOnItemExpanded.bind(null, itemsList)).observe(itemsList, {childList: true});
})();

function insertItemPageLinkOnItemExpanded(itemsList, mutations) {
    const addedItemInfoMutation = mutations.find(mutation => {
        return mutation.addedNodes.length === 1 && mutation.addedNodes[0].classList.contains('show-item-info');
    });
    if (! addedItemInfoMutation) {
        return;
    }

    insertItemPageLink(
        Array.from(itemsList.children).find(li => li.classList.contains('act')),
        addedItemInfoMutation.addedNodes[0]
    );
}

async function insertItemPageLink(expandedItemLi, itemInfoLi) {
    const expandedItemId = expandedItemLi.querySelector('[itemid]').getAttribute('itemid');

    const itemInfoSpan = await truthy(() => itemInfoLi.querySelector('.item-cont .item-wrap .info-msg'));
    const shortDescriptionDiv = itemInfoSpan.firstElementChild;

    const anchor = document.createElement('a');
    anchor.href = 'https://www.torn.com/imarket.php#/p=shop&type=' + expandedItemId;
    anchor.style.paddingLeft = '1rem';
    anchor.style.backgroundImage = 'url("https://arsonwarehouse.com/images/awh-icon-48.png")';
    anchor.style.backgroundRepeat = 'no-repeat';
    anchor.style.backgroundSize = '.75rem';
    anchor.style.backgroundPositionX = '.125rem';
    anchor.style.color = '#B53471';
    anchor.style.textDecoration = 'none';
    anchor.innerText = 'View in item market';
    shortDescriptionDiv.appendChild(anchor);
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