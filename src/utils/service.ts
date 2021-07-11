export function Service(config?) {
    return function (constructor: Function): Function {
        return constructor;
    }
}