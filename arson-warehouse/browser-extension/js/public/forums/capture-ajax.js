onLoadForumPage(() => {
    // ...
});

function onLoadForumPage(onLoadHandler) {
    const xhrOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url) {
        console.log('awh',url.substr(0, 16));
        if (method.toUpperCase() === 'POST' && url.substr(0, 16) === 'forums.php?rfcv=') {
            console.log('awh stopped loading forum - todo');
            return;
            // this.onload = onLoadHandler;
        }
        xhrOpen.apply(this, arguments);
    };
}