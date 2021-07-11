export class Subscription<T> {
    private readonly onUnsubscribe: (subscription: Subscription<T>) => void;

    constructor(onUnsubscribe: (subscription: Subscription<T>) => void) {
        this.onUnsubscribe = onUnsubscribe;
    }

    unsubscribe(): void {
        this.onUnsubscribe(this);
    }
}