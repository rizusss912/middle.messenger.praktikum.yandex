export type ChainPromiseValue<T> = {value: T, next: ChainPromise<T>} | null;
export type ChainPromise<T> = Promise<ChainPromiseValue<T>>;