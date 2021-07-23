export type ChainPromiseValue<T> = {value: T, next: ChainPromise<T>};
export type ChainPromise<T> = Promise<ChainPromiseValue<T>>;