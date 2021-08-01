import {
    UploadedUserDataAction,
    UploadErrorUserDataAction } from "../actions/authorization.actions";
import { dataStatus } from "../enums/data-status.enum";
import { authorizationActionType } from "../enums/authorization-action-type.enum";
import { reducerAdapt } from "../functions/reduser-adaptor";
import { AuthorizationState } from "../interfaces/authorization-state.interface";
import { reducer } from "./reducer";

const _authorizationReducers: Record<authorizationActionType, reducer<AuthorizationState>> = {
    [authorizationActionType.upload]:
        (state: AuthorizationState) => 
            ({
                ...state,
                userData: {
                    ...state.userData,
                    status: dataStatus.loading,
                },
            }),

    [authorizationActionType.uploaded]:
        (state: AuthorizationState, action: UploadedUserDataAction) =>
            ({
                ...state,
                userData: {
                    ...state.userData,
                    status: dataStatus.valid,
                    data: action.payload,
                    time: Date.now(),
                },
            }),

    [authorizationActionType.uploadError]:
        (state: AuthorizationState, action: UploadErrorUserDataAction) =>
            ({
                ...state,
                userData: {
                    ...state.userData,
                    status: dataStatus.error,
                    error: action.payload,
                },
            }),
}

export const authorizationReducers = reducerAdapt(_authorizationReducers, 'authorization');