global.Vue.component('ModalWithBackdrop', {
    template: `
<div :class="['awh-modal-with-backdrop', {'behind-chats': behindChats}]">
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
    <a v-if="! behindChats" href="#" class="awh-bring-chats-to-front-button" @click.prevent="behindChats = true" title="Bring chats to front">🔃</a>
</div>`,
    props: ['modalClass', 'title'],
    data() {
        return {
            behindChats: false,
        };
    },
});