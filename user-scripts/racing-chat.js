// ==UserScript==
// @name         Racing Chat
// @namespace    https://github.com/sulsay/torn
// @version      1.0
// @description  Turns driver name into chat link
// @author       Sulsay [2173590]
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        none
// ==/UserScript==

(async function () {
    turnDriversIntoChatLinksInCurrentDriversList();

    // On change race tab, turn driver names into chat links again:
    new MutationObserver(turnDriversIntoChatLinksInCurrentDriversList).observe(document.getElementById('racingAdditionalContainer'), {childList: true});
})();

async function turnDriversIntoChatLinksInCurrentDriversList() {
    const driversList = document.getElementById('leaderBoard');
    if (driversList === null) {
        return;
    }

    watchForDriversListContentChanges(driversList);

    for (let driver of driversList.querySelectorAll('.driver-item')) {
        const driverId = getDriverId(driver);
        const nameSpan = driver.querySelector('.name span');

        const chatLink = document.createElement('a');
        chatLink.href = '#';
        chatLink.innerText = nameSpan.innerText.trim();
        chatLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.chat.r(driverId)
        });
        nameSpan.removeChild(nameSpan.firstChild);
        nameSpan.insertBefore(chatLink, null);
    }
}

function watchForDriversListContentChanges(driversList) {
    if (driversList.dataset.hasWatcher !== undefined) {
        return;
    }

    setTimeout(() => {
        // The content of #leaderBoard is rebuilt periodically so watch for changes:
        new MutationObserver(turnDriversIntoChatLinksInCurrentDriversList).observe(driversList, {childList: true});
        driversList.dataset.hasWatcher = 'true';
    }, 0);
}

function getDriverId(driverUl) {
    return +driverUl.closest('li').id.substr(4);
}