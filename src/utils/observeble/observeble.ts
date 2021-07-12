import {ChainPromise, ChainPromiseValue} from './chain-promise';
import {Subscription} from './subscription';

export class Observable<T> {
    private readonly subscriptionMap = new Map<Subscription<T>, (value: T) => void>();
    private _value: T;
    private hasValue: boolean = false;
    private promise: ChainPromise<T>;

    constructor(chainPromise: ChainPromise<T>, value?: T) {
        if (arguments.length > 1) {
            this._value = value;
            this.hasValue = true;
        }

        this.promise = chainPromise;
        chainPromise.then(value => this.onNext(value));
    }

    public subscribe(handler: (value?: T) => void): Subscription<T> {
        const subscription = new Subscription(this.getUnsubscribeFunction(this.subscriptionMap));
        
        this.subscriptionMap.set(subscription, handler);
        // т.к. следующее значение может быть и undefined, используем hasValue
        if (this.hasValue) {
            handler(this._value);
        }

        return subscription;
    }

    public map<R>(handler: (value?: T) => R): Observable<R> {
        function mapPromise(promise: ChainPromise<T>): ChainPromise<R> {
            return promise.then(chain => {
                return {
                    value: handler(chain.value),
                    next: mapPromise(chain.next),
                };
            });
        };

        if (this.hasValue) {
            return new Observable<R>(mapPromise(this.promise), handler(this._value));
        } else {
            return new Observable<R>(mapPromise(this.promise));
        }
    }

    public filter(handler: (value?: T) => boolean): Observable<T> {
        function filterPromise(promise: ChainPromise<T>): ChainPromise<T> {
            return promise.then(chain => {
                if (handler(chain.value)) {
                    return {
                        value: chain.value,
                        next: filterPromise(chain.next),
                    };
                } else {
                    return filterPromise(chain.next);
                }
            });
        };

        if (this.hasValue && handler(this._value)) {
            return new Observable<T>(filterPromise(this.promise), this._value);
        } else {
            return new Observable<T>(filterPromise(this.promise));
        }
    }

    public on(handler: (value?: T) => void): Observable<T> {
        function onPromise(promise: ChainPromise<T>): ChainPromise<T> {
            return promise.then(chain => {
                handler(chain.value);

                return {
                    value: chain.value,
                    next: onPromise(chain.next),
                };
            });
        };

        if (this._value) handler(this._value);
        if (this.hasValue) {
            return new Observable<T>(onPromise(this.promise), this._value);
        } else {
            return new Observable<T>(onPromise(this.promise));
        }
    }

    public startWith(value: T): Observable<T> {
        return new Observable<T>(this.promise, value);
    }

    public uniqueNext(approveFirst = true, checkUnicue?: (last: T, next: T) => boolean): Observable<T> {
        if (typeof checkUnicue !== 'function') {
            checkUnicue = (last, next) => last !== next || (!this.hasValue && approveFirst);
        }

        var last = this._value;

        return this
            .filter(value => checkUnicue(last, value))
            .on(value => last = value);
    }

    private onNext(value: ChainPromiseValue<T>): void {
        if (!value) {
            this.onFinish();

            return;
        }

        this._value = value.value;
        this.hasValue = true;
        this.emitValue(value.value);
        this.promise = value.next;
        value.next.then(value => this.onNext(value));
    }

    private emitValue(value: T): void {
        for (var handler of this.subscriptionMap.values()) {
            handler(value);
        }
    }

    private onFinish(): void {
        this.subscriptionMap.clear();
    }

    private getUnsubscribeFunction(map: Map<Subscription<T>, (value: T) => void>): (subscription: Subscription<T>) => void {
        return function onUnsubscribe(subscription: Subscription<T>): void {
            if (map.has(subscription)) {
                map.delete(subscription);
            }
        } 
    }
}
