import {
    UploadedUserDataAction,
    UploadErrorUserDataAction } from "../actions/user-data.actions";
import { dataStatus } from "../enums/data-status.enum";
import { userDataActionType } from "../enums/user-data.enum";
import { reducerAdapt } from "../functions/reduser-adaptor";
import { UserDataState } from "../interfaces/user-data-state.interface";
import { reducer } from "./reducer";

const _userDataReducers: Record<userDataActionType, reducer<UserDataState>> = {
    [userDataActionType.upload]:
        (state: UserDataState) => 
            ({...state, status: dataStatus.loading}),

    [userDataActionType.uploaded]:
        (state: UserDataState, action: UploadedUserDataAction) =>
            ({...state, status: dataStatus.valid, data: action.payload, time: Date.now()}),

    [userDataActionType.uploadError]:
        (state: UserDataState, action: UploadErrorUserDataAction) =>
            ({...state, status: dataStatus.error, error: action.payload}),
}

export const userDataReducers = reducerAdapt(_userDataReducers, 'userData');