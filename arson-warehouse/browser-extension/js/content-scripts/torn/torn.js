const scriptTag = document.createElement('script');
scriptTag.src = chrome.runtime.getURL('js/page-scripts/collect-equipment-stats.js');
scriptTag.onload = function() {
    this.remove();
};
document.head.appendChild(scriptTag);

scriptTag.addEventListener('arson-warehouse-event-from-page', (event) => {
    const {action, payload} = event.detail;
    if (! ['received-equipment-report'].includes(action)) {
        return;
    }
    chrome.runtime.sendMessage({action, payload});
});