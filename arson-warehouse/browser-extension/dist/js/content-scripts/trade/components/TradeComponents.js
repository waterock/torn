global.Vue.component('TradeComponents', {
    template: `
<div class="trade-components">
    <a
        v-if="!readOnly" 
        href="#" 
        class="back-to-overview-button" 
        @click.prevent="$emit('back-to-overview-button-clicked')"
    >&laquo; {{ hasUnsavedPrices ? 'Save and return' : 'Return to overview' }}</a>
    
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
            :read-only="readOnly"
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
        hasUnsavedPrices: Boolean,
        components: Array,
        priceByKey: Object,
        grandTotal: Number,
        readOnly: Boolean,
    },
    mixins: [vueMixins.formatCurrency],
});
