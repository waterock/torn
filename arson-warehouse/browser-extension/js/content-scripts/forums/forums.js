(async function () {
    const head = await getDocumentHead();

    const scriptTag = document.createElement('script');
    scriptTag.src = chrome.runtime.getURL('js/public/forums/capture-ajax.js?id=' + chrome.runtime.id);
    scriptTag.onload = function() {
        this.remove();
    };
    head.appendChild(scriptTag);
})();

function getDocumentHead() {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (let addedNode of mutation.addedNodes) {
                        if (addedNode.tagName === 'HEAD') {
                            observer.disconnect();
                            resolve(addedNode);
                        }
                    }
                }
            }
        });

        observer.observe(document.querySelector('html'), {childList: true});
    });
}
