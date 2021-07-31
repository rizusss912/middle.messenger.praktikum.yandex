import { Observable } from "../utils/observeble/observeble";
import { Subject } from "../utils/observeble/subject";
import { defaultState } from "./consts/default-state.const";
import { Action } from "./interfaces/action.interface";
import { State } from "./interfaces/state.interface";
import { getReducer, reducer } from "./reducers/reducer";

let instance: Store;

export class Store {
    private _state: State = defaultState;

    private readonly _$state: Subject<State> = new Subject<State>(this._state);
    private readonly reduser: reducer<State> = getReducer();

    constructor() {
        if (instance) return instance;

        instance = this;
    }

    get $state(): Observable<State> {
        return this._$state.asObserveble();
    }

    get state(): State {
        return this._state;
    }

    dispatch(action: Action): void {
        const nextState = this.reduser(this._state, action);

        this._state = nextState;
        this._$state.next(nextState);
    }
}