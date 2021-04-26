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
        const nameWithOptionalQuantity = this._$root.querySelector('.name').firstChild.textContent.trim();
        const quantityPositionInText = this._getQuantityPositionInText(nameWithOptionalQuantity);

        if (!quantityPositionInText) {
            return { name: nameWithOptionalQuantity, quantity: 1 };
        }

        const splitParts = nameWithOptionalQuantity.split(' ');
        const quantityPartIndex = { start: 0, end: splitParts.length - 1 }[quantityPositionInText];
        const quantityAsString = splitParts[quantityPartIndex].substr(1);
        const quantity = parseInt(quantityAsString, 10);

        if (isNaN(quantity) || quantity.toString().length !== quantityAsString.length) {
            return { name: nameWithOptionalQuantity, quantity: 1 };
        }

        return {
            name: splitParts.filter((_, i) => i !== quantityPartIndex).join(' ').trim(),
            quantity,
        };
    }
    _getQuantityPositionInText(nameWithOptionalQuantity) {
        if (/^x\d+\s/.test(nameWithOptionalQuantity)) {
            return 'start';
        } else if (/\sx\d+$/.test(nameWithOptionalQuantity)) {
            return 'end';
        }
        return null;
    }
}
