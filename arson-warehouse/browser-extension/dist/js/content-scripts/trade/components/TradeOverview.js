global.Vue.component('TradeOverview', {
    template: `
<div class="trade-overview">
    <trade-warnings v-if="warnings.length > 0" :warnings="warnings"/>
    <trade-total :total-value="grandTotal" :trade-id="tradeId" @view-components-button-clicked="$emit('view-components-button-clicked')"/>
    <trade-messages :messages="messages" :has-custom-copyable-messages="hasCustomCopyableMessages"/>
</div>`,
    props: ['tradeId', 'warnings', 'grandTotal', 'messages', 'hasCustomCopyableMessages'],
});
