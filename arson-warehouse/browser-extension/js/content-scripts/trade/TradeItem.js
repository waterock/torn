class TradeItem {
    constructor($root) {
        this._$root = $root;
        this._$deleteAnchor = this._$root.querySelector('div.del a');

        const {name, quantity} = this._splitNameFromQuantity();
        this._name = name;
        this._quantity = quantity;
    }
    getApiRequestData() {
        const data = {quantity: this._quantity};

        const id = this._getId();
        if (id !== null) {
            data.id = id;
        } else {
            data.name = this._name;
        }

        return data;
    }
    _getId() {
        if (this._$deleteAnchor === null) {
            return null;
        }

        const hrefParts = this._$deleteAnchor.href.split('&');
        for (let hrefPart of hrefParts) {
            if (hrefPart.indexOf('itemID=') === 0) {
                return parseInt(hrefPart.substr(7));
            }
        }
    }
    _splitNameFromQuantity() {
        const nameWithOptionalQuantity = this._$root.querySelector('.name').innerText.trim();

        const lastXPosition = nameWithOptionalQuantity.lastIndexOf('x');
        if (lastXPosition === -1) {
            return {name: nameWithOptionalQuantity, quantity: 1};
        }

        const quantityString = nameWithOptionalQuantity.substr(lastXPosition + 1);
        const quantity = parseInt(quantityString, 10);

        if (isNaN(quantity) || quantity.toString().length !== quantityString.length) {
            return {name: nameWithOptionalQuantity, quantity: 1};
        }

        return {name: nameWithOptionalQuantity.substr(0, lastXPosition - 1), quantity};
    }
}