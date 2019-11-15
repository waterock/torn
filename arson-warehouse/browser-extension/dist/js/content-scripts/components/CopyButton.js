global.Vue.component('CopyButton', {
    template: `
<div :class="['copy-button', copyState]" @click="copy">
    <slot/>
</div>`,
    props: ['textToCopy'],
    data() {
        return {
            copyState: 'copy-button-enabled',
        };
    },
    methods: {
        async copy() {
            if (this.copyState !== 'copy-button-enabled') {
                return;
            }

            try {
                await navigator.clipboard.writeText(this.textToCopy);
                this.copyState = 'copied';
                this.$emit('copied');
            } catch (error) {
                this.copyState = 'failed-to-copy';
            } finally {
                setTimeout(() => {
                    this.copyState = 'copy-button-enabled';
                }, 1500);
            }
        }
    }
});