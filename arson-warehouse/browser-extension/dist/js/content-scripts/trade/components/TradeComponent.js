global.Vue.component('TradeComponent', {
    template: `
<tr class="trade-component">
    <td class="trade-component-name">
        {{ component.name }}
        <template v-if="editing">
            <div style="font-size:.8rem">
                original price: <a href="#" @click.prevent="revertToAutoPrice">{{ formatCurrency(component.auto_price) }}</a>
            </div>
        </template>
    </td>
    <td class="trade-component-unit-price">
        <template v-if="readOnly">
            {{ formatCurrency(price) }}
        </template>
        <template v-else>
            <a v-if="!editing" href="#" @click.prevent="editing = true">{{ formatCurrency(component.auto_price) }}</a>
            <input v-else style="text-align:right" type="number" step="1" :value="price" @input="updatePrice">
        </template>
    </td>
    <td class="trade-component-quantity">{{ component.quantity }}</td>  
    <td class="trade-component-total-price">{{ formatCurrency(component.quantity * price) }}</td>
</tr>`,
    props: {
        readOnly: Boolean,
        component: Object,
        price: Number,
    },
    mixins: [vueMixins.formatCurrency],
    data() {
        return {
            editing: !this.readOnly && this.price !== this.component.auto_price,
        };
    },
    methods: {
        updatePrice(event) {
            this.$emit('price-updated', +event.target.value);
        },
        revertToAutoPrice() {
            this.editing = false;
            this.$emit('price-updated', this.component.auto_price);
        }
    },
});
