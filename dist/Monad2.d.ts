import { Options, Plans } from './types';
export declare class Monad<T extends Plans = Plans, Merged extends boolean = false> {
    #private;
    private _plan;
    options?: Options<Merged> | undefined;
    constructor(_plan: T, options?: Options<Merged> | undefined);
    previous?: Monad<any, boolean>;
    get plan(): T;
    merge: <P extends Plans<any, any>>(monad: Monad<P, false>) => Monad<P, true>;
    get unMerge(): this;
    and: (monad: Monad<T, false>) => Monad<T, false>;
    or: (monad: Monad<T, false>) => Monad<T, false>;
}
