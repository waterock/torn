global.Vue.component('TradeModal', {
    template: `
<modal-with-backdrop
    title="Trade value"
    modal-class="awh-trade-value-modal"
    @close-button-pressed="tryCloseModal"
    @backdrop-pressed="tryCloseModal"
    >
    <template v-slot:body>
        <template v-if="loading">
            <div class="loading-trade-value">
                <img src="https://www.torn.com/images/v2/main/ajax-loader.gif" alt="Loading...">
            </div>
        </template>
        <template v-else-if="tradeValueResponse.error">
            <p v-html="tradeValueResponse.error"/>
        </template>
        <template v-else>
            <trade-overview
                v-if="mode === 'overview'"
                :trade-id="trade.id"
                :warnings="trade.warnings"
                :grand-total="grandTotal"
                :messages="messages"
                :has-custom-copyable-messages="tradeValueResponse.has_custom_copyable_messages"
                @view-components-button-clicked="setMode('components')"
            />
            <trade-components
                v-if="mode === 'components'"
                :has-unsaved-prices="hasUnsavedPrices"
                :components="trade.components"
                :price-by-key="priceByKey"
                :grand-total="grandTotal"
                :read-only="!tradeValueResponse.requested_by_buyer"
                @component-price-updated="(key, price) => priceByKey[key] = price"
                @back-to-overview-button-clicked="setMode('overview')"
            />
        </template>
    </template>
</modal-with-backdrop>`,
    props: ['tradeValueResponse'],
    data() {
        return {
            mode: null,
            priceByKey: {},
        };
    },
    computed: {
        loading() {
            return this.tradeValueResponse === null;
        },
        trade() {
            if (this.loading) {
                return null;
            }
            return this.tradeValueResponse.trade || null;
        },
        hasUnsavedPrices() {
            if (this.loading || Object.entries(this.priceByKey).length === 0) {
                return false;
            }
            return this.trade.components.some(({ key, applied_price }) => {
                return applied_price !== this.priceByKey[key];
            });
        },
        messages() {
            if (this.loading) {
                return null;
            }
            return this.tradeValueResponse.copyable_messages || null;
        },
        grandTotal() {
            if (this.loading) {
                return 0;
            }

            let total = 0;
            for (let component of this.trade.components) {
                total += this.priceByKey[component.key] * component.quantity;
            }

            return total;
        },
    },
    methods: {
        async setMode(mode) {
            if (!['overview', 'components'].includes(mode)) {
                return;
            }
            this.mode = mode;

            if (this.mode === 'overview' && this.hasUnsavedPrices) {
                const response = await this.saveCustomPrices();

                this.tradeValueResponse = {
                    ...this.tradeValueResponse,
                    trade: {
                        ...this.tradeValueResponse.trade,
                        components: response.trade.components,
                    },
                    copyable_messages: response.copyable_messages,
                };
            }
        },
        saveCustomPrices() {
            return new Promise((resolve) => {
                const oneTimeResponseHandler = (message) => {
                    if (message.action === 'did-save-custom-prices') {
                        chrome.runtime.onMessage.removeListener(oneTimeResponseHandler);
                        resolve(message.payload);
                    }
                }
                chrome.runtime.onMessage.addListener(oneTimeResponseHandler);

                chrome.runtime.sendMessage({
                    action: 'save-custom-prices',
                    payload: {
                        tradeId: this.trade.id,
                        priceByKey: this.priceByKey,
                    },
                });
            })
        },
        tryCloseModal() {
            if (this.hasUnsavedPrices && !window.confirm('Price changes will be lost. Really close?')) {
                return;
            }
            this.$emit('close')
        }
    },
    watch: {
        tradeValueResponse() {
            for (let component of this.tradeValueResponse.trade.components) {
                const price = component.custom_price || component.auto_price;
                this.$set(this.priceByKey, component.key, price);
            }

            if (this.tradeValueResponse.requested_by_buyer) {
                this.setMode('overview');
            } else {
                this.setMode('components');
            }
        },
    }
});
