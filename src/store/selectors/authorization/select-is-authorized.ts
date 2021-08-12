import {dataStatus} from '../../enums/data-status.enum';
import {State} from '../../interfaces/state.interface';
import {selectDataStatus} from '../data/select-status';
import {selectAuthToken} from './select-auth-token';

export function selectIsAuthorized(state: State): boolean {
	const authTokenStatus = selectDataStatus(selectAuthToken(state));

	// По дефолту считаем что мы авторизированы,
	// поскольку нет валидных способов узнать есть ли токен в куках(
	return authTokenStatus === dataStatus.valid || authTokenStatus === dataStatus.default;
}
