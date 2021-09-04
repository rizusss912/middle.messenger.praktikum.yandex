import {Action, actionType} from '../interfaces/action.interface';
import {State} from '../interfaces/state.interface';
import {reducer} from '../reducers/reducer';

export function reducerAdapt<selectedReducer>(
	reducers: selectedReducer,
	selector: keyof State,
): Record<actionType, reducer<State>> {
	const globalReducers = {} as Record<actionType, reducer<State>>;

	for (const [actionType, reducer] of Object.entries(reducers)) {
		// @ts-ignore
		globalReducers[actionType] = function (state: State, action: Action): State {
			return {
				...state,
				[selector]: reducer(state[selector], action),
			};
		};
	}

	return globalReducers;
}
