import {State} from '../../interfaces/state.interface';
import {selectDataValue} from '../data/select-data-value';
import {selectUserData} from './select-user-data';

export function selectUserId(state: State): number | undefined {
	return selectDataValue(selectUserData(state))?.id;
}
