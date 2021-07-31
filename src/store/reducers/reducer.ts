import { Action, actionType } from "../interfaces/action.interface";
import { State } from "../interfaces/state.interface";
import { userDataReducers } from "./user-data-reducers";

export type reducer<selectedState> = (state: selectedState, action: Action) => selectedState;

export function getReducer(): reducer<State> {
    const reducers: Record<actionType, reducer<State>> = Object.assign({}, userDataReducers);

    return function(state: State, action: Action): State {
        return reducers[action.type](state, action);
    }
}