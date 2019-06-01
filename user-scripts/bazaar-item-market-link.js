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
    new ItemMarketLinkInserter().bindTo(itemsList);
})();

class ItemMarketLinkInserter {
    bindTo(itemsList) {
        new MutationObserver(this._insertLinkOnItemExpanded.bind(this, itemsList))
            .observe(itemsList, {childList: true});
    }
    _insertLinkOnItemExpanded(itemsList, mutations) {
        const addedItemInfoLi = this._getNewlyOpenedItemInfoPane(mutations);
        if (addedItemInfoLi === null) {
            return;
        }
        this._insertLink(
            Array.from(itemsList.children).find(li => li.classList.contains('act')),
            addedItemInfoLi
        );
    }
    async _insertLink(expandedItemLi, itemInfoLi) {
        const expandedItemId = expandedItemLi.querySelector('[itemid]').getAttribute('itemid');

        const itemInfoSpan = await truthy(() => itemInfoLi.querySelector('.item-cont .item-wrap .info-msg'));
        const shortDescriptionDiv = itemInfoSpan.firstElementChild;

        const itemMarketLinkHtml = `<a href="/imarket.php#/p=shop&type=${expandedItemId}" style="${this._getItemMarketLinkStyles().join(';')}">View in item market</a>`;
        shortDescriptionDiv.insertAdjacentHTML('beforeend', itemMarketLinkHtml);
    }
    _getNewlyOpenedItemInfoPane(mutations) {
        const mutation = mutations.find(mutation => {
            return mutation.addedNodes.length === 1 && mutation.addedNodes[0].classList.contains('show-item-info')
        });
        return mutation ? mutation.addedNodes[0] : null;
    }
    _getItemMarketLinkStyles() {
        return [
            'color: #B53471',
            'text-decoration: none',
            'padding-left: 1rem',
            'background: url(\'https://arsonwarehouse.com/images/awh-icon-48.png\') .125rem/.75rem no-repeat',
        ];
    }
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