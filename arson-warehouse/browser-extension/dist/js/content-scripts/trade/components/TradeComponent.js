global.Vue.component('TradeComponent', {
    template: `
<tr class="trade-component">
    <td class="trade-component-name">{{ component.name }}</td>
    <td class="trade-component-unit-price">
        <template v-if="! editingPrice">
            <span @click="editPrice" style="color:blue">{{ unitPriceForDisplay }}</span>
        </template>
        <template v-else>
            <money-input/>
        </template>
    </td>
    <td class="trade-component-quantity">{{ component.quantity }}</td>  
    <td class="trade-component-total-price">{{ totalPriceForDisplay }}</td>
</tr>`,
    props: ['component'],
    mixins: [vueMixins.formatCurrency],
    data() {
        return {
            editingPrice: false,
        }
    },
    computed: {
        unitPriceForDisplay() {
            return this.formatCurrency(this.component.unit_price);
        },
        totalPriceForDisplay() {
            return this.formatCurrency(this.component.total_price);
        }
    },
    methods: {
        editPrice() {
            this.editingPrice = true;
        },
    }
});
