import {ChainPromise, ChainPromiseValue} from './chain-promise';
import {Subscription} from './subscription';

export class Observable<T> {
    private readonly subscriptionMap = new Map<Subscription<T>, (value: T) => void>();
    private _value: T;
    private hasValue: boolean = false;

    constructor(chainPromise: ChainPromise<T>, value?: T) {
        if (arguments.length > 1) {
            this._value = value;
            this.hasValue = true;
        }

        chainPromise.then(this.onNext);
    }

    public subscribe(handler: (value?: T) => void): Subscription<T> {
        const subscription = new Subscription(this.onUnsubscribe);
        
        this.subscriptionMap.set(subscription, handler);
        // т.к. следующее значение может быть и undefined,
        // мы считаем что значение не задано когда _value равно нашему объекту
        if (this.hasValue) {
            handler(this._value);
        }

        return subscription;
    }

    private onNext(value: ChainPromiseValue<T>): void {
        if (!value) {
            this.onFinish();

            return;
        }

        this._value = value.value;
        this.hasValue = true;
        this.emitValue(value.value);
        value.next.then(this.onNext);
    }

    private emitValue(value: T): void {
        for (var handler of this.subscriptionMap.values()) {
            handler(value);
        }
    }

    private onFinish(): void {
        this.subscriptionMap.clear();
    }

    private onUnsubscribe(subscription: Subscription<T>): void {
            if (this.subscriptionMap.has(subscription)) {
                this.subscriptionMap.delete(subscription);
            }
        } 
    }
}