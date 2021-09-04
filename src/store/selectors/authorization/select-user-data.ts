import {Data} from '../../interfaces/data.interface';
import {State} from '../../interfaces/state.interface';
import {userData} from '../../interfaces/authorization-state.interface';

export function selectUserData(state: State): Data<userData> {
	return state.authorization.userData;
}
