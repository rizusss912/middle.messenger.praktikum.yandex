import { authorizationActionType } from "../enums/authorization-action-type.enum";
import { Action } from "../interfaces/action.interface";
import { userData } from "../interfaces/authorization-state.interface";

export class UploadUserDataAction implements Action {
    public readonly type = authorizationActionType.upload;
}

export class UploadedUserDataAction implements Action {
    public readonly type = authorizationActionType.uploaded;
    public readonly payload: userData;

    constructor(data: userData) {
        this.payload = data;
    }
}

export class UploadErrorUserDataAction implements Action {
    public readonly type = authorizationActionType.uploadError;
    public readonly payload: Error;

    constructor(error: Error) {
        this.payload = error;
    }
}