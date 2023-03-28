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
    setMapper: <R = unknown>(mapper?: { [key in keyof T]: (data: Param<T, key>) => R; } | (Partial<{ [key in keyof T]: (data: Param<T, key>) => R; }> & {
        else: (data: Param<T, keyof T>) => R;
    }) | undefined) => void;
    transform<R = unknown>(mapper?: Mapper<T, R>, flush?: boolean): R;
    transformValue(data: Param<T>): unknown;
    change: <R extends Def = Def>(other: Monad<R>, mapper?: { [key in keyof T]: (data: Param<T, key>) => Param<R, keyof R>; } | (Partial<{ [key in keyof T]: (data: Param<T, key>) => Param<R, keyof R>; }> & {
        else: (data: Param<T, keyof T>) => Param<R, keyof R>;
    }) | undefined) => Monad<R>;
    next: (...datas: unknown[]) => void;
}
