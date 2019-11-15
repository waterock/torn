global.Vue.component('TradeMessage', {
    template: `
<div :class="['trade-message', copyState]">
    <div class="trade-message-name">{{ message.name }}:</div>
    <div class="trade-message-body">{{ message.body }}</div>
    <a href="#" class="trade-message-copy" @click.prevent="copy" title="Copy to clipboard">
        <span class="copy-icon copy-available">📋</span>
        <span v-if="copyState === 'copied'" class="copy-icon copied">✔️</span>
        <span v-if="copyState === 'failed-to-copy'" class="copy-icon failed-to-copy">❌️</span>
    </a>
</div>`,
    props: ['message'],
    data() {
        return {
            copyState: 'copy-button-enabled',
        };
    },
    methods: {
        async copy(event) {
            if (this.copyState !== 'copy-button-enabled') {
                return;
            }

            try {
                await navigator.clipboard.writeText(this.message.body);
                this.copyState = 'copied';
            } catch (error) {
                this.copyState = 'failed-to-copy';
            } finally {
                setTimeout(() => {
                    this.copyState = 'copy-button-enabled';
                }, 1500);
            }
        },
    }
});