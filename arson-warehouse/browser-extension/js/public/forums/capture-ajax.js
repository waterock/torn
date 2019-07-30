onLoadForumPage((request) => {
    // TODO alternative: observe forums-page-wrap
});

function onLoadForumPage(onLoadHandler) {
    const xhrOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url) {
        if (method.toUpperCase() === 'POST' && url.substr(0, 16) === 'forums.php?rfcv=') {
            this._isForumsRequest = true;
        }
        xhrOpen.apply(this, arguments);
    };

    const xhrSend = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function (data) {
        if (this._isForumsRequest && data.indexOf('step=threads') > -1) {
            this.onload = onLoadHandler.bind(null, this);
        }
        xhrSend.apply(this, arguments);
    }
}