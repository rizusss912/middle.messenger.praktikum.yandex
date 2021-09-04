import {dataStatus} from '../enums/data-status.enum';
import {Data} from '../interfaces/data.interface';

export function getDefaultData<T>(): Data<T> {
	return {
		status: dataStatus.default,
		time: undefined,
		error: undefined,
		value: undefined,
	};
}
