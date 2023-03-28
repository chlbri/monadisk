import { Monad } from './Monad2';
import { History2, PlanReturns, Plans, Subscriber } from './types';
export declare class Interpreter<T extends Plans = Plans, Merged extends boolean = false> {
    #private;
    private monad;
    constructor(monad: Monad<T, Merged>);
    get isUsed(): boolean;
    get current(): T | undefined;
    get history(): History2<T, unknown>[];
    addSubscribers: (...subscribers: Subscriber[]) => void;
    next: <V>(value: unknown) => PlanReturns<T, V, Merged>;
}
