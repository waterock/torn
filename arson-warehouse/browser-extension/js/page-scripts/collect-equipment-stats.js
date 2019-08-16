(function (currentScript) {
    onEquipmentDetailsLoaded((request, queryParams) => {
        const equipmentDetails = JSON.parse(request.responseText);

        const stats = {};
        for (let extra of equipmentDetails.extras) {
            const stat = extra.title.toLowerCase();
            if (['damage', 'accuracy', 'armor'].includes(stat)) {
                stats[stat] = extra.value;
            }
        }

        if (Object.entries(stats).length === 0) {
            return;
        }

        const equipmentReport = {
            equipmentId: parseInt(queryParams.armouryID, 10),
            itemId: parseInt(queryParams.itemID, 10),
            reporterId: parseInt(window.getCookie('uid'), 10),
            stats
        };

        currentScript.dispatchEvent(new CustomEvent('arson-warehouse-event-from-page', {
            detail: {
                action: 'received-equipment-report',
                payload: equipmentReport,
            },
        }));
    });

    function onEquipmentDetailsLoaded(onLoadHandler) {
        const xhrOpen = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function (method, url) {
            if (method.toUpperCase() === 'POST' && url.substr(0, 19) === 'inventory.php?rfcv=') {
                this._isInventoryRequest = true;
            }
            xhrOpen.apply(this, arguments);
        };

        const xhrSend = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.send = function (data) {
            if (this._isInventoryRequest) {
                const queryParams = {};
                for (let [key, value] of data.split('&').map(pair => pair.split('='))) {
                    queryParams[key] = value;
                }
                this.onload = onLoadHandler.bind(null, this, queryParams);
            }
            xhrSend.apply(this, arguments);
        }
    }
})(document.currentScript);