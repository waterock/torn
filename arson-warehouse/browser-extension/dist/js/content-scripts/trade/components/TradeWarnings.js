global.Vue.component('TradeWarnings', {
    template: `
<div class="trade-warnings">
    <ul>
        <li v-for="warning of warnings" :key="warning">{{ warning }}</li>
    </ul>
</div>`,
    props: ['warnings'],
});