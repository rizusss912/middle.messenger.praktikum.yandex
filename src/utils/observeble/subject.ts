import { ChainPromise, ChainPromiseValue } from "./chain-promise";
import {Observable} from "./observeble";

type DeferPromise<T, Error> = {
    promise: Promise<T>,
    resolve: (value: T) => void,
    reject: (error: Error) => void,
};

function deferPromise<T, Error>(): DeferPromise<T, Error> {
        var resolvingFunctions;
        const promise = new Promise<T>(function(resolve, reject) {
            resolvingFunctions = { resolve, reject };
        });

        return {promise, resolve: resolvingFunctions.resolve, reject: resolvingFunctions.reject};
}
    

export class Subject<T> {
    private _value: T;
    private hasValue: boolean;
    private deferPromise: DeferPromise<ChainPromiseValue<T>, Error>;

    constructor(value?: T) {
        this.hasValue = arguments.length > 0;

        if(this.hasValue) {
            this._value = value;
        }

        this.deferPromise = deferPromise<ChainPromiseValue<T>, Error>();
    }

    public next(value?: T) {
        const nextdeferPromise = deferPromise<ChainPromiseValue<T>, Error>();

        this._value = value;
        this.hasValue = true;
        this.deferPromise.resolve({value: this._value, next: nextdeferPromise.promise});
        this.deferPromise = nextdeferPromise;
    }

    public asObserveble() {
        if (this.hasValue) {
            return new Observable(this.deferPromise.promise, this._value);
        } else {
            return new Observable(this.deferPromise.promise);
        }
    }
}