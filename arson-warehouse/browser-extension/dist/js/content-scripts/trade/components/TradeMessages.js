global.Vue.component('TradeMessages', {
    template: `
<div class="trade-messages">
    <template v-if="messages.length > 0">
        <trade-message v-for="message of messages" :key="message.name" :message="message"/>
    </template>
    <template v-else>
        <p class="custom-messages-notice">Add copyable message templates on <a href="https://arsonwarehouse.com/login" target="_blank" rel="noopener noreferrer">arsonwarehouse.com</a>.</p>
    </template>
</div>`,
    props: ['messages'],
});