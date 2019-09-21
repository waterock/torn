global.Vue.component('TradeMessages', {
    template: `
<div class="trade-messages">
    <trade-message v-for="message of messages" :key="message.name" :message="message"/>
    <p class="custom-messages-notice">Custom messages will be added soon!</p>
</div>`,
    props: ['messages'],
});