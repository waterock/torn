global.Vue.component('TradeComponent', {
    template: `
<tr class="trade-component">
    <td class="trade-component-name">
        {{ component.name }}
        <template v-if="editing">
            <div style="font-size:.8rem">
                regular price: <a href="#" @click.prevent="revertToRegularPrice">{{ formatCurrency(component.regular_price) }}</a>
            </div>
        </template>
    </td>
    <td class="trade-component-unit-price">
        <div>
            <a v-if="!editing" href="#" @click.prevent="editing = true">{{ formatCurrency(component.regular_price) }}</a>
            <input v-else style="text-align:right" type="number" step="1" :value="price" @input="updatePrice">
        </div>
    </td>
    <td class="trade-component-quantity">{{ component.quantity }}</td>  
    <td class="trade-component-total-price">{{ formatCurrency(component.quantity * price) }}</td>
</tr>`,
    props: {
        component: Object,
        price: Number,
    },
    mixins: [vueMixins.formatCurrency],
    data() {
        return {
            editing: this.price !== this.component.regular_price,
        };
    },
    methods: {
        updatePrice(event) {
            this.$emit('price-updated', +event.target.value);
        },
        revertToRegularPrice() {
            this.editing = false;
            this.$emit('price-updated', this.component.regular_price);
        }
    },
});
