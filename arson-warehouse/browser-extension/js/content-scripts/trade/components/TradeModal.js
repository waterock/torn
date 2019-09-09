global.Vue.component('TradeModal', {
    template: `
<modal-with-backdrop title="Trade value" modal-class="awh-trade-value-modal" @close-button-pressed="$emit('close')" @backdrop-pressed="$emit('close')">
    <template v-slot:body>
        <template v-if="trade === null">
            <div class="loading-trade-value">
                <img src="https://www.torn.com/images/v2/main/ajax-loader.gif" alt="Loading...">
            </div>
        </template>
        <template v-else>
            <trade-components :components="trade.trade_value.components"/>
        </template>
    </template>
    <template v-if="trade !== null" v-slot:footer>
        <div class="trade-value-total">Total: {{ formatCurrency(trade.trade_value.total_price) }}</div>
        <div class="receipt-link-wrapper">
            <a :href="trade.receipt_url" class="receipt-link" target="_blank" rel="noopener noreferrer">{{ trade.receipt_url }}</a>
        </div>
    </template>
</modal-with-backdrop>`,
    props: ['trade'],
    methods: {
        formatCurrency(value) {
            return '$' + value.toLocaleString('en-US');
        }
    }
});