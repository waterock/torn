class TradeValueModal {
    constructor() {
        this._backdropElement = null;
        this._modalElement = null;
        this._modalBody = null;
        this._headerText = 'Trade value';
    }
    open() {
        this._ensureModalStyleIsInjected();

        this._modalElement = document.createElement('div');
        this._modalElement.className = 'arson-warehouse-modal';
        document.body.appendChild(this._modalElement);

        const modalContent = document.createElement('div');
        modalContent.className = 'arson-warehouse-modal-content';
        this._modalElement.appendChild(modalContent);

        const modalHeader = this._createModalHeader();
        modalContent.appendChild(modalHeader);

        this._modalBody = document.createElement('div');
        this._modalBody.className = 'arson-warehouse-modal-body';
        this._modalBody.innerHTML = '<div class="loading"><img src="https://www.torn.com/images/v2/main/ajax-loader.gif" alt="Loading..."></div>';
        modalContent.appendChild(this._modalBody);

        this._backdropElement = document.createElement('div');
        this._backdropElement.className = 'arson-warehouse-modal-backdrop';
        document.body.appendChild(this._backdropElement);

        this._closeModalOnClick(this._backdropElement);
        this._closeModalOnClick(modalHeader.querySelector('.close'));
    }
    close() {
        this._backdropElement.remove();
        this._modalElement.remove();
    }
    setBodyHtml(bodyHtml) {
        this._modalBody.innerHTML = bodyHtml;
    }
    _createModalHeader() {
        const modalHeader = document.createElement('div');
        modalHeader.className = 'arson-warehouse-modal-header';

        const modalTitle = document.createElement('h4');
        modalTitle.className = 'modal-title';
        modalTitle.innerText = this._headerText;
        modalHeader.appendChild(modalTitle);

        const closeButton = document.createElement('button');
        closeButton.className = 'close';
        closeButton.type = 'button';
        closeButton.innerHTML = '&times;';
        modalHeader.appendChild(closeButton);

        return modalHeader;
    }
    _closeModalOnClick(element) {
        element.addEventListener('click', () => this.close());
    }
    _ensureModalStyleIsInjected() {
        if (document.head.querySelector('style.arson-warehouse-modal') !== null) {
            return;
        }

        new StyleInjector()
            .add('.arson-warehouse-modal', {
                'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                'font-size': '16px',
                'position': 'fixed',
                'top': 0,
                'left': 0,
                'bottom': 0,
                'right': 0,
                'z-index': 10001,
                'margin': '1.75rem 0',
                'padding': '.5rem',
                'pointer-events': 'none',
            })
            .add('.arson-warehouse-modal-content', {
                'display': 'flex',
                'flex-direction': 'column',
                'max-height': '100%',
                'border': '1px solid rgba(0,0,0,0.15)',
                'border-radius': '.3rem',
                'background-color': 'white',
                'max-width': '600px',
                'margin': '0 auto',
                'box-shadow': '0 .25rem 1rem rgba(0,0,0,.3)',
                'pointer-events': 'auto',
            })
            .add('.arson-warehouse-modal-header', {
                'padding': '1rem',
                'border-bottom': '1px solid #e9ecef',
                'display': 'flex',
                'justify-content': 'space-between',
                'align-items': 'flex-start',
            })
            .add('.arson-warehouse-modal-header h4', {
                'color': '#B53471',
                'margin': '0',
                'font-size': '18.4px',
                'line-height': '1.42857',
                'font-weight': 500,
            })
            .add('.arson-warehouse-modal-header .close', {
                'font-size': '24px',
                'font-weight': 700,
                'line-height': 1,
                'cursor': 'pointer',
                'padding': 0,
                'background': 'transparent',
                'border': 0,
                'outline': 0,
                'opacity': .2,
                'color': 'black',
            })
            .add('.arson-warehouse-modal-body', {
                'flex': '1',
                'overflow-y': 'auto',
                'padding': '1rem',
                'line-height': '26px',
            })
            .add('.arson-warehouse-modal-body .loading', {
                'text-align': 'center',
            })
            .add('.arson-warehouse-modal-body hr', {
                'margin': '1em 0',
            })
            .add('.arson-warehouse-modal-body .receipt-url', {
                'text-align': 'right',
                'font-size': '.8rem',
            })
            .add('.arson-warehouse-modal-body .receipt-url a', {
                'color': '#aaa',
            })
            .add('.arson-warehouse-modal-backdrop', {
                'position': 'fixed',
                'top': 0,
                'left': 0,
                'bottom': 0,
                'right': 0,
                'z-index': 10000,
                'background-color': 'black',
                'opacity': .5,
            })
            .inject('arson-warehouse-modal');
    }
}
