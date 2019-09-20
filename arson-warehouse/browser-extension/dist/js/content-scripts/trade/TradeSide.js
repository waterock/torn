class TradeSide {
    constructor($root) {
        this._$root = $root;
        this._items = null;
    }
    getUserName() {
        return this._$root.querySelector('.title-black').innerText.trim();
    }
    getItems() {
        if (this._items === null) {
            const $itemsList = this._$root.querySelector('li.color2 ul');
            this._items = this._getItemsFromList($itemsList);
        }

        return this._items;
    }
    _getItemsFromList($list) {
        if ($list === null) {
            return [];
        }

        const $listItems = Array.from($list.querySelectorAll('li'));
        if ($listItems.length === 1 && $listItems[0].innerText.indexOf('No items in trade') > -1) {
            return [];
        }

        return $listItems.map($li => new TradeItem($li));
    }
}