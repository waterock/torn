// ==UserScript==
// @name         Bazaar Scam Warning
// @namespace    https://arsonwarehouse.com
// @version      1.0
// @description  Puts a big red warning on items that are priced way above their market value
// @author       Sulsay [2173590]
// @match        https://www.torn.com/bazaar.php
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const settings = {
    tornApiKey: 'YOUR_KEY_HERE',
    itemsToWarnFor: [
        35, // Box of Chocolate Bars
        205, // Vicodin
        364, // Box of Grenades
        365, // Box of Medical Supplies
    ],
};

const marketValueByItemId = new Map();

(async function() {
    const itemsList = await truthy(() => document.querySelector('.bazaar-main-wrap .items-list'));
    const itemListItems = Array.from(itemsList.children).filter(li => ! li.classList.contains('empty'));
    insertWarningsForItemListItemsIfPriceIsTooHigh(itemListItems);

    new MutationObserver(handleChangedItemsListChildren).observe(itemsList, {childList: true});
})();

async function insertWarningsForItemListItemsIfPriceIsTooHigh(itemListItems) {
    if (itemListItems.length === 0) {
        return;
    }

    const itemIds = itemListItems
        .map(li => parseInt(li.querySelector('.img-wrap').getAttribute('itemid'), 10))
        .filter(unique)
        .filter(itemId => settings.itemsToWarnFor.includes(itemId));

    try {
        await ensureMarketValueIsLoadedForItems(itemIds);
    } catch (error) {
        alert('The user script "Bazaar Scam Warning" could not load items data. Did you enter your API key?\n\nTorn API says: ' + error.message);
    }

    itemListItems
        .filter(isPriceTooHigh)
        .forEach(insertWarning);
}

function handleChangedItemsListChildren(mutations) {
    let newItemListItems = [];
    for (let mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            newItemListItems = Array.from(mutation.addedNodes).filter(li => ! li.classList.contains('empty'));
            break;
        }
    }
    insertWarningsForItemListItemsIfPriceIsTooHigh(newItemListItems);
}

function isPriceTooHigh(itemListItem) {
    const itemId = parseInt(itemListItem.querySelector('.img-wrap').getAttribute('itemid'), 10);
    const listedPrice = parseInt(itemListItem.querySelector('.price').innerText.replace('$', '').replace(/,/g, ''));

    return listedPrice > marketValueByItemId.get(itemId) * 2;
}

function insertWarning(itemListItem) {
    const descriptionSpan = itemListItem.querySelector('.desc');
    descriptionSpan.style.color = 'red';
    descriptionSpan.style.fontWeight = 'bold';

    const priceSpan = descriptionSpan.querySelector('.price');
    priceSpan.innerText = `!! ${priceSpan.innerText} !!`;
}

async function ensureMarketValueIsLoadedForItems(itemIds) {
    const itemIdsToFetch = itemIds.filter(itemId => ! marketValueByItemId.has(itemId));
    if (itemIdsToFetch.length === 0) {
        return Promise.resolve();
    }

    const items = await fetchItems(itemIds);
    Object.entries(items).forEach(([itemId, apiData]) => {
        marketValueByItemId.set(parseInt(itemId, 10), apiData.market_value);
    });
}

function fetchItems(itemIds) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/torn/${itemIds.join(',')}?selections=items&key=${settings.tornApiKey}`,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: (response) => {
                if (response.status !== 200) {
                    return reject(new Error('HTTP status code ' + response.status));
                }
                try {
                    const responseJson = JSON.parse(response.responseText);
                    if (responseJson.error) {
                        return reject(new Error(responseJson.error.error || 'Unknown error'));
                    }
                    resolve(responseJson.items);
                } catch (error) {
                    reject(error)
                }
            },
            onerror: (error) => {
                reject(error)
            }
        });
    });
}

function unique(item, index, array) {
    return array.indexOf(item) === index;
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