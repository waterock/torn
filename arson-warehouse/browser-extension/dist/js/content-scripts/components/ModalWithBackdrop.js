global.Vue.component('ModalWithBackdrop', {
    template: `
<div class="awh-modal-with-backdrop">
    <div :class="'awh-modal ' + modalClass">
        <div class="awh-modal-content">
            <div class="awh-modal-header">
                <h4>{{ title }}</h4>
                <button class="close" @click="$emit('close-button-pressed')">&times;</button>
            </div>
            <div class="awh-modal-body">
                <slot name="body"/>
            </div>
            <div v-if="$slots.footer" class="awh-modal-footer">
                <slot name="footer"/>
            </div>
        </div>
    </div>
    <div class="awh-modal-backdrop" @click="$emit('backdrop-pressed')"></div>
</div>`,
    props: ['modalClass', 'title'],
});