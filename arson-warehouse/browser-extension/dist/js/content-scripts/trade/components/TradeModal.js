global.Vue.component('TradeModal', {
    template: `
<modal-with-backdrop title="Trade value" modal-class="awh-trade-value-modal" @close-button-pressed="$emit('close')" @backdrop-pressed="$emit('close')">
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
                :total-value="trade.total_price"
                :messages="messages"
                :has-custom-copyable-messages="tradeValueResponse.has_custom_copyable_messages"
                @view-components-button-clicked="setMode('components')"
            />
            <trade-components
                v-if="mode === 'components'"
                :components="trade.components"
                :grand-total="trade.total_price"
                :allow-user-to-return-to-overview="tradeValueResponse.requested_by_buyer"
                @back-to-overview-button-clicked="setMode('overview')"
            />
        </template>
    </template>
</modal-with-backdrop>`,
    props: ['tradeValueResponse'],
    data() {
        return {
            mode: null,
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
        messages() {
            if (this.loading) {
                return null;
            }
            return this.tradeValueResponse.copyable_messages || null;
        }
    },
    methods: {
        setMode(mode) {
            if (! ['overview', 'components'].includes(mode)) {
                return;
            }
            this.mode = mode;
        }
    },
    watch: {
        tradeValueResponse() {
            if (this.tradeValueResponse.requested_by_buyer) {
                this.setMode('overview');
            } else {
                this.setMode('components');
            }
        },
    }
});