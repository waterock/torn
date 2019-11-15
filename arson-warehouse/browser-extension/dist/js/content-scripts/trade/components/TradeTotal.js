global.Vue.component('TradeTotal', {
    template: `
<div class="trade-total">
    <div class="total-value">{{ formatCurrency(totalValue) }}</div>
    <div class="trade-total-actions">
        <a href="#" @click.prevent="enterMoney" class="enter-money" title="Enter this value into the money field">Enter</a>
        <a href="#" @click.prevent="$emit('view-components-button-clicked')" title="View individual prices">View list</a>
    </div>
</div>`,
    props: ['tradeId', 'totalValue'],
    methods: {
        enterMoney() {
            window.location = `https://www.torn.com/trade.php?money=${this.totalValue}#step=addmoney&ID=${this.tradeId}`;
            if (window.location.search.indexOf('money=') > -1) {
                window.location.reload();
            }
        },
        formatCurrency(value) {
            return '$' + value.toLocaleString('en-US');
        },
    },
});