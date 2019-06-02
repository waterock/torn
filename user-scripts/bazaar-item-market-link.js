// ==UserScript==
// @name         Bazaar Item Market Link
// @namespace    https://github.com/sulsay/torn
// @version      1.1
// @description  Adds link "View in item market" on expanded items in bazaar
// @author       Sulsay [2173590]
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// ==/UserScript==

(async function () {
    const itemsList = await truthy(() => document.querySelector('.bazaar-main-wrap .items-list'));
    new MutationObserver(insertMarketLinkOnItemPaneOpened.bind(null, itemsList)).observe(itemsList, {childList: true});
})();

function insertMarketLinkOnItemPaneOpened(itemsList, mutations) {
    const itemPane = getNewlyOpenedItemPane(mutations);
    if (itemPane === null) {
        return;
    }
    insertMarketLink(itemPane);
}

async function insertMarketLink(itemPane) {
    const itemId = getActiveItem(itemPane).querySelector('[itemid]').getAttribute('itemid');
    const itemInfoSpan = await truthy(() => itemPane.querySelector('.item-cont .item-wrap .info-msg'));
    const shortDescriptionDiv = itemInfoSpan.firstElementChild;

    const marketLinkHtml = `<a href="/imarket.php#/p=shop&type=${itemId}" style="${getItemMarketLinkStyles().join(';')}">View in item market</a>`;
    shortDescriptionDiv.insertAdjacentHTML('beforeend', marketLinkHtml);
}

function getNewlyOpenedItemPane(mutations) {
    const infoPaneAddition = mutations.find(mutation => {
        return mutation.addedNodes.length === 1 && mutation.addedNodes[0].classList.contains('show-item-info');
    });
    return infoPaneAddition ? infoPaneAddition.addedNodes[0] : null;
}

function getActiveItem(infoPane) {
    return getPossibleActiveItems(infoPane).find(li => li.classList.contains('act'));
}

function getPossibleActiveItems(infoPane) {
    const firstPrevious = infoPane.previousElementSibling, secondPrevious = firstPrevious.previousElementSibling, thirdPrevious = secondPrevious.previousElementSibling;
    return [firstPrevious, secondPrevious, thirdPrevious];
}

function getItemMarketLinkStyles() {
    return [
        'color: #B53471',
        'text-decoration: none',
        'padding-left: 1rem',
        'background: url(\'https://arsonwarehouse.com/images/awh-icon-48.png\') .125rem/.75rem no-repeat',
    ];
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