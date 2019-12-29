(async function () {
    const itemsList = await truthy(() => document.querySelector('.items-list'));

    let viewButtonHover = null;

    itemsList.addEventListener('mouseover', (event) => {
        const viewButton = event.target.closest('button.view-h');
        if (viewButton === null || (viewButtonHover && viewButtonHover.getViewButton() === viewButton)) {
            return;
        }

        viewButtonHover = new ViewButtonHover(viewButton)
            .onShortlyAfterHoverStart((armouryId) => {
                if (armouryId === null) {
                    return;
                }

                // todo cache results
                // todo create popover element, include loading spinner

                const armouryStatsPopover = new ArmouryStatsPopover(armouryId);

            })
            .onHoverEnded(() => {
                viewButtonHover = null;
            });
    });
})();
