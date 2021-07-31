import { userDataActionType } from "../enums/user-data.enum";
import { Action } from "../interfaces/action.interface";
import { userData } from "../interfaces/user-data-state.interface";

export class UploadUserDataAction implements Action {
    public readonly type = userDataActionType.upload;
}

export class UploadedUserDataAction implements Action {
    public readonly type = userDataActionType.uploaded;
    public readonly payload: userData;

    constructor(data: userData) {
        this.payload = data;
    }
}

export class UploadErrorUserDataAction implements Action {
    public readonly type = userDataActionType.uploadError;
    public readonly payload: Error;

    constructor(error: Error) {
        this.payload = error;
    }
}