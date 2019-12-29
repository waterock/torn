class ArmouryStatsPopover {
    constructor(armouryId) {
        console.log('start loading');
        this._fetchStats(armouryId).then(stats => {
            console.log('stats loading done', stats);
        });
    }
    _fetchStats(armouryId) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'get-armoury-stats',
                payload: {armouryId},
            });

            const oneTimeListener = (message) => {
                if (message.action === 'did-get-armoury-stats' && message.payload.armoury_id === armouryId) {
                    const armouryStats = message.payload;
                    chrome.runtime.onMessage.removeListener(oneTimeListener);
                    resolve(armouryStats);
                }
            };

            chrome.runtime.onMessage.addListener(oneTimeListener);
        });
    }
}