global.Vue.component('TradeComponents', {
    template: `
<div class="trade-components">
    <a
        v-if="allowUserToReturnToOverview" 
        href="#" 
        class="back-to-overview-button" 
        @click.prevent="$emit('back-to-overview-button-clicked')"
    >&laquo; {{ hasCustomPrices ? 'Save and return' : 'Return to overview' }}</a>
    
    <table class="trade-components-table">
        <thead>
            <tr>
                <th class="trade-component-name">Component</th>
                <th class="trade-component-unit-price">Unit price</th>
                <th class="trade-component-quantity">Qty</th>
                <th class="trade-component-total-price">Total price</th>
            </tr>
        </thead>
        <tbody>
        <tr v-for="component of components"
            is="trade-component"
            :key="component.name"
            :component="component"
            :price="priceByKey[component.key]"
            @price-updated="price => $emit('component-price-updated', component.key, price)"
        />
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" class="trade-components-grand-total">Total: {{ formatCurrency(grandTotal) }}</td>
            </tr>
        </tfoot>
    </table>
</div>`,
    props: {
        hasCustomPrices: Boolean,
        components: Array,
        priceByKey: Object,
        grandTotal: Number,
        allowUserToReturnToOverview: Boolean,
    },
    mixins: [vueMixins.formatCurrency],
});
