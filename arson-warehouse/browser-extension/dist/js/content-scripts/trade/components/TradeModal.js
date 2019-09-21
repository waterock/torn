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
            <div v-if="isRequestedByBuyer" class="trade-tabs">
                <a :href="mode !== 'overview' ? '#' : null" :class="{active: mode === 'overview'}" @click.prevent="setMode('overview')">Overview</a>
                <a :href="mode !== 'messages' ? '#' : null" :class="{active: mode === 'messages'}" @click.prevent="setMode('messages')">Messages</a>
            </div>
            <trade-overview v-if="mode === 'overview'" :warnings="trade.warnings" :components="trade.components"/>
            <trade-messages v-if="messages !== null && mode === 'messages'" :messages="messages"/>
        </template>
    </template>
    <template v-if="! loading && ! tradeValueResponse.error" v-slot:footer>
        <div class="trade-value-total">Total: {{ formatCurrency(trade.total_price) }}</div>
        <div v-if="isRequestedByBuyer && tradeValueResponse.receipt_url" class="receipt-link-wrapper">
            <a :href="tradeValueResponse.receipt_url" class="receipt-link" target="_blank" rel="noopener noreferrer">{{ tradeValueResponse.receipt_url }}</a>
        </div>
    </template>
</modal-with-backdrop>`,
    props: ['tradeValueResponse'],
    data() {
        return {
            mode: 'overview',
        };
    },
    computed: {
        loading() {
            return this.tradeValueResponse === null;
        },
        isRequestedByBuyer() {
            if (this.loading) {
                return false;
            }
            return this.tradeValueResponse.requested_by_buyer || false;
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
            if (! ['overview', 'messages'].includes(mode)) {
                return;
            }
            this.mode = mode;
        },
        formatCurrency(value) {
            return '$' + value.toLocaleString('en-US');
        }
    }
});