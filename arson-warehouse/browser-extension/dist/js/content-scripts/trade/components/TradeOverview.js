global.Vue.component('TradeOverview', {
    template: `
<div class="trade-overview">
    <ul v-if="warnings.length > 0" class="trade-warnings">
        <li v-for="warning of warnings" :key="warning">{{ warning }}</li>
    </ul>
    <trade-components :components="components"/>
</div>`,
    props: ['warnings', 'components'],
});