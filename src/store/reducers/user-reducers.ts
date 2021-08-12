import {
	UploadedChangePasswordAction,
	UploadedChangeUserDataAction,
	UploadErrorChangePasswordAction,
	UploadErrorChangeUserDataAction} from '../actions/user.actions';
import {dataStatus} from '../enums/data-status.enum';
import {userActionType} from '../enums/user-action-type.enum';
import {reducerAdapt} from '../functions/reduser-adaptor';
import {State} from '../interfaces/state.interface';
import {UserState} from '../interfaces/user-state.interface';
import {reducer} from './reducer';

const _userReducers: Partial<Record<userActionType, reducer<UserState>>> = {
	[userActionType.changePasswordUpload]:
        (state: UserState) =>
        	({
        		...state,
        		changePassword: {
        			...state.changePassword,
        			status: dataStatus.loading,
        		},
        	}),

	[userActionType.changePasswordUploaded]:
        (state: UserState, action: UploadedChangePasswordAction) =>
        	({
        		...state,
        		changePassword: {
        			...state.changePassword,
        			error: undefined,
        			status: dataStatus.valid,
        			value: action.payload,
        			time: Date.now(),
        		},
        	}),

	[userActionType.changePasswordUploadError]:
        (state: UserState, action: UploadErrorChangePasswordAction) =>
        	({
        		...state,
        		changePassword: {
        			...state.changePassword,
        			status: dataStatus.error,
        			error: action.payload,
        		},
        	}),

	[userActionType.changeUserDataUpload]:
        (state: UserState) =>
        	({
        		...state,
        		changeUserData: {
        			...state.changeUserData,
        			status: dataStatus.loading,
        		},
        	}),

	[userActionType.changeUserDataUploadError]:
        (state: UserState, action: UploadErrorChangeUserDataAction) =>
        	({
        		...state,
        		changeUserData: {
        			...state.changeUserData,
        			status: dataStatus.error,
        			error: action.payload,
        		},
        	}),
};

const _globalUserReducers: Partial<Record<userActionType, reducer<State>>> = {
	[userActionType.changeUserDataUploaded]:
        (state: State, action: UploadedChangeUserDataAction) =>
        	({
        		...state,
        		user: {
        			...state.user,
        			changeUserData: {
        				...state.user.changeUserData,
        				error: undefined,
        				status: dataStatus.valid,
        				value: undefined,
        				time: Date.now(),
        			},
        		},
        		authorization: {
        			...state.authorization,
        			userData: {
        				...state.authorization.userData,
        				error: undefined,
        				status: dataStatus.valid,
        				value: action.payload,
        				time: Date.now(),
        			},
        		},
        	}),
};

export const userReducers: Record<userActionType, reducer<State>>
    = Object.assign(reducerAdapt(_userReducers, 'user'), _globalUserReducers);
