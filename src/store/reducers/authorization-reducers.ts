import {
	UploadedAuthTokenAction,
	UploadedLogoutAction,
	UploadedUserDataAction,
	UploadErrorAuthTokenAction,
	UploadErrorLogoutAction,
	UploadErrorUserDataAction} from '../actions/authorization.actions';
import {dataStatus} from '../enums/data-status.enum';
import {authorizationActionType} from '../enums/authorization-action-type.enum';
import {reducerAdapt} from '../functions/reduser-adaptor';
import {AuthorizationState} from '../interfaces/authorization-state.interface';
import {reducer} from './reducer';

// TODO: кажется, нужно создавать редьюсеры для изменения состояния Data в одном месте,
// иначе изменить интерфейс Data потом будет нереально
const _authorizationReducers: Record<authorizationActionType, reducer<AuthorizationState>> = {
	[authorizationActionType.authTokenUpload]:
        (state: AuthorizationState) =>
        	({
        		...state,
        		authToken: {
        			...state.authToken,
        			status: dataStatus.loading,
        		},
        	}),

	[authorizationActionType.authTokenUploaded]:
        (state: AuthorizationState, action: UploadedAuthTokenAction) =>
        	({
        		...state,
        		authToken: {
        			...state.authToken,
        			error: undefined,
        			status: dataStatus.valid,
        			value: action.payload,
        			time: Date.now(),
        		},
        	}),

	[authorizationActionType.authTokenUploadError]:
        (state: AuthorizationState, action: UploadErrorAuthTokenAction) =>
        	({
        		...state,
        		authToken: {
        			...state.authToken,
        			status: dataStatus.error,
        			error: action.payload,
        		},
        	}),

	[authorizationActionType.logoutUpload]:
        (state: AuthorizationState) =>
        	({
        		...state,
        		authToken: {
        			...state.authToken,
        			status: dataStatus.loading,
        		},
        	}),

	[authorizationActionType.logoutUploaded]:
        (state: AuthorizationState, action: UploadedLogoutAction) =>
        	({
        		...state,
        		logout: {
        			...state.logout,
        			error: undefined,
        			status: dataStatus.valid,
        			value: action.payload,
        			time: Date.now(),
        		},
        		authToken: {
        			...state.authToken,
        			status: dataStatus.invalid,
        		},
        	}),

	[authorizationActionType.logoutUploadError]:
        (state: AuthorizationState, action: UploadErrorLogoutAction) =>
        	({
        		...state,
        		logout: {
        			...state.logout,
        			status: dataStatus.error,
        			error: action.payload,
        		},
        	}),

	[authorizationActionType.userDataUpload]:
        (state: AuthorizationState) =>
        	({
        		...state,
        		logout: {
        			...state.logout,
        			status: dataStatus.loading,
        		},
        	}),

	[authorizationActionType.userDataUploaded]:
        (state: AuthorizationState, action: UploadedUserDataAction) =>
        	({
        		...state,
        		userData: {
        			...state.userData,
        			error: undefined,
        			status: dataStatus.valid,
        			value: action.payload,
        			time: Date.now(),
        		},
        	}),

	[authorizationActionType.userDataUploadError]:
        (state: AuthorizationState, action: UploadErrorUserDataAction) =>
        	({
        		...state,
        		userData: {
        			...state.userData,
        			status: dataStatus.error,
        			error: action.payload,
        		},
        	}),
};

export const authorizationReducers = reducerAdapt(_authorizationReducers, 'authorization');
