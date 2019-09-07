window.Vue.component('TradeComponents', {
    template: `
<table class="trade-components">
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
    />
    </tbody>
</table>`,
    props: ['components'],
});
