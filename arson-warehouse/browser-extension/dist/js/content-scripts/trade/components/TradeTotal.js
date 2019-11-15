global.Vue.component('TradeTotal', {
    template: `
<div class="trade-total">
    <div class="total-value">
        <span>$</span>
        <span :class="['numeric-trade-value', {'highlighted' : highlightingNumericTradeValue}]">{{ formatCurrencyWithoutDollarSymbol(totalValue) }}</span>
    </div>
    <div class="trade-total-actions">
        <copy-button :text-to-copy="formatCurrencyWithoutDollarSymbol(totalValue)" @copied="didCopyTradeValue">
            <a href="#" @click.prevent class="copy-trade-value" title="Copy the value to your clipboard">📋 <span class="button-text">Copy</span></a>
        </copy-button>
        <a href="#" @click.prevent="$emit('view-components-button-clicked')" title="View individual prices">📜 <span class="button-text">View list</span></a>
    </div>
</div>`,
    props: ['tradeId', 'totalValue'],
    data() {
        return {
            highlightingNumericTradeValue: false,
        };
    },
    methods: {
        didCopyTradeValue() {
            this.highlightingNumericTradeValue = true;
            setTimeout(() => {
                this.highlightingNumericTradeValue = false;
            }, 1500);
        },
        formatCurrencyWithoutDollarSymbol(value) {
            return value.toLocaleString('en-US');
        },
    },
});