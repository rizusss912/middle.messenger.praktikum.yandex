import {dataStatus} from '../store/enums/data-status.enum';
import {Action} from '../store/interfaces/action.interface';
import {reducer} from '../store/reducers/reducer';

export class DataReducersHelper {
	public static createUploadReducer<state>(field: keyof state): reducer<state> {
		return (state: state) =>
			({
				...state,
				[field]: {
					...state[field],
					status: dataStatus.loading,
				},
			});
	}

	public static createUploadedReducer<state, action extends Action>(
		field: keyof state,
	): reducer<state> {
		return (state: state, action: action) =>
			({
				...state,
				[field]: {
					...state[field],
					error: undefined,
					status: dataStatus.valid,
					value: action.payload,
					time: Date.now(),
				},
			});
	}

	public static createUploadErrorReducer<state, action extends Action>(
		field: keyof state,
	): reducer<state> {
		return (state: state, action: action) =>
			({
				...state,
				[field]: {
					...state[field],
					status: dataStatus.error,
					error: action.payload,
				},
			});
	}
}
