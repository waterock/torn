global.Vue.component('TradeMessage', {
    template: `
<div class="trade-message">
    <div class="trade-message-name">{{ message.name }}:</div>
    <div class="trade-message-body">{{ message.body }}</div>
    <a href="#" @click.prevent="copy" :class="{'trade-message-copy': true, 'temporarily-disabled': temporaryCopyLinkText !== null}">
        &raquo; <span class="copy-text">{{ temporaryCopyLinkText || 'Copy' }}</span>
    </a>
</div>`,
    props: ['message'],
    data() {
        return {
            temporaryCopyLinkText: null,
        };
    },
    methods: {
        async copy(event) {
            if (this.temporaryCopyLinkText !== null) {
                return;
            }

            try {
                await navigator.clipboard.writeText(this.message.body);
                this.temporaryCopyLinkText = 'Copied!';
            } catch (error) {
                this.temporaryCopyLinkText = 'Failed to copy...';
            } finally {
                setTimeout(() => {
                    this.temporaryCopyLinkText = null;
                }, 2000);
            }
        },
    }
});