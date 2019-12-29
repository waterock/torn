function truthy(handler) {
    return new Promise(resolve => {
        const resolveIfHandlerReturnsTruthy = () => {
            let result = handler();
            if (result) {
                resolve(result);
            } else {
                setTimeout(resolveIfHandlerReturnsTruthy, 100);
            }
        };
        resolveIfHandlerReturnsTruthy();
    });
}