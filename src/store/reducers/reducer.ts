import { Action, actionType } from "../interfaces/action.interface";
import { State } from "../interfaces/state.interface";
import { authorizationReducers } from "./authorization-reducers";

export type reducer<state> = (state: state, action: Action) => state;

export function getReducer(): reducer<State> {
    const reducers: Record<actionType, reducer<State>> = Object.assign({}, authorizationReducers);

    return function(state: State, action: Action): State {
        return reducers[action.type](state, action);
    }
}