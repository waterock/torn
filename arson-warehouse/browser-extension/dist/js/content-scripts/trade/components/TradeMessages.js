global.Vue.component('TradeMessages', {
    template: `
<div class="trade-messages">
    <template v-if="messages.length > 0">
        <trade-message v-for="message of messages" is="trade-message" :key="message.name" :message="message"></trade-message>
    </template>
    <template v-if="hasCustomCopyableMessages === false">
        <p class="custom-messages-notice">Add custom message templates on <a href="https://arsonwarehouse.com/trading/messages" target="_blank" rel="noopener noreferrer">arsonwarehouse.com</a>.</p>
    </template>
</div>`,
    props: ['messages', 'hasCustomCopyableMessages'],
});