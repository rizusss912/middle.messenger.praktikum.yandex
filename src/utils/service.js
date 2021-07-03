export function Service(config) {
    return function (constructor) {
        return constructor;
    }
}