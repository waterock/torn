global.Vue.component('TradeOverview', {
    template: `
<div class="trade-overview">

    <div v-if="latestUnreadAnnouncement && !announcementDismissed" class="announcement">
        <div v-html="nl2br(latestUnreadAnnouncement.html)"></div>
        <div class="dismiss-announcement-button-wrapper">
            <a href="#" @click.prevent="dismissAnnouncement">Don't show again</a>
        </div>
    </div>

    <trade-warnings v-if="warnings.length > 0" :warnings="warnings"/>
    <trade-total :total-value="grandTotal" :trade-id="tradeId" @view-components-button-clicked="$emit('view-components-button-clicked')"/>
    <trade-messages :messages="messages" :has-custom-copyable-messages="hasCustomCopyableMessages"/>
</div>`,
    props: ['tradeId', 'warnings', 'grandTotal', 'messages', 'hasCustomCopyableMessages', 'latestUnreadAnnouncement'],
    mixins: [vueMixins.nl2br],
    data() {
        return {
            announcementDismissed: false,
        }
    },
    methods: {
        dismissAnnouncement() {
            this.announcementDismissed = true;

            chrome.runtime.sendMessage({
                action: 'dismiss-announcement',
                payload: {
                    tradeId: this.tradeId,
                    announcementId: this.latestUnreadAnnouncement.id,
                },
            });
        }
    }
});
