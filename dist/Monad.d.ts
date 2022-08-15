import { Def, History, Mapper, Param, Subscriber } from './types';
export declare class Monad<T extends Def = Def> {
    #private;
    private def;
    current?: unknown;
    constructor(def: T, current?: unknown);
    get isUndefined(): boolean;
    get _mapped(): unknown;
    get history(): History<Def, unknown>[];
    createMap: <R>(mapper: Mapper<T, R>) => Mapper<T, R>;
    subscribe: (subscriber: Subscriber<Param<T>>) => void;
    setMapper: <R = unknown>(mapper: Mapper<T, R>) => void;
    transform<R = unknown>(mapper: Mapper<T, R>, flush?: boolean): R;
    merge: <R extends Def = Def>(other: Monad<R>, mapper?: ({ [key in keyof T]: (data: Param<T, key>) => Param<R, keyof R>; } & {
        else: (data?: Param<T, keyof T> | undefined) => Param<R, keyof R>;
    }) | (Partial<{ [key in keyof T]: (data: Param<T, key>) => Param<R, keyof R>; }> & {
        else: (data?: Param<T, keyof T> | undefined) => Param<R, keyof R>;
    }) | undefined) => Monad<R>;
    next: (...datas: unknown[]) => void;
}
