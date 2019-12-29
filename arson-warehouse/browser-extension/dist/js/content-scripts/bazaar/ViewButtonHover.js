class ViewButtonHover {
    constructor(viewButton) {
        this._viewButton = viewButton;
        this._viewButton.addEventListener('mouseleave', this._endHover.bind(this), {once: true});

        this._onShortlyAfterHoverStart = () => {};
        this._onHoverEnded = () => {};

        this._shortlyAfterHoverStartTimeout = setTimeout(() => {
            this._onShortlyAfterHoverStart(this._getArmouryId());
        }, 100);
    }
    onShortlyAfterHoverStart(handler) {
        this._onShortlyAfterHoverStart = handler;
        return this;
    }
    onHoverEnded(handler) {
        this._onHoverEnded = handler;
        return this;
    }
    getViewButton() {
        return this._viewButton;
    }

    _getArmouryId() {
        const armouryIdAsString = this._viewButton.closest('.img-wrap').getAttribute('armouryid');
        if (armouryIdAsString === '0') {
            return null;
        }
        return /^\d+$/.test(armouryIdAsString) ? parseInt(armouryIdAsString, 10) : null;
    }
    _endHover() {
        clearTimeout(this._shortlyAfterHoverStartTimeout);
        this._onHoverEnded();
    }
}