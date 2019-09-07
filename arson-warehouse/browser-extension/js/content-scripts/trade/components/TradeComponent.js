window.Vue.component('TradeComponent', {
    template: `
<tr class="trade-component">
    <td class="trade-component-name">{{ component.name }}</td>
    <td class="trade-component-unit-price">{{ unitPriceForDisplay }}</td>
    <td class="trade-component-quantity">{{ component.quantity }}</td>  
    <td class="trade-component-total-price">{{ totalPriceForDisplay }}</td>
</tr>`,
    props: ['component'],
    computed: {
        unitPriceForDisplay() {
            return this.formatCurrency(this.component.unit_price);
        },
        totalPriceForDisplay() {
            return this.formatCurrency(this.component.total_price);
        }
    },
    methods: {
        formatCurrency(value) {
            return '$' + value.toLocaleString('en-US');
        }
    }
});
