import { userActionType } from "../enums/user-action-type.enum";
import { Action } from "../interfaces/action.interface";
import { userData } from "../interfaces/authorization-state.interface";
import { changePassword } from "../interfaces/user-state.interface";

export class UploadChangeUserDataAction implements Action {
    public readonly type = userActionType.changeUserDataUpload;
}

export class UploadedChangeUserDataAction implements Action {
    public readonly type = userActionType.changeUserDataUploaded;
    public readonly payload: userData;

    constructor(newUserData: userData) {
        this.payload = newUserData;
    }
}

export class UploadErrorChangeUserDataAction implements Action {
    public readonly type = userActionType.changeUserDataUploadError;
    public readonly payload: Error;

    constructor(error: Error) {
        this.payload = error;
    }
}

export class UploadChangePasswordAction implements Action {
    public readonly type = userActionType.changePasswordUpload;
}

export class UploadedChangePasswordAction implements Action {
    public readonly type = userActionType.changePasswordUploaded;
    public readonly payload: changePassword;
}

export class UploadErrorChangePasswordAction implements Action {
    public readonly type = userActionType.changePasswordUploadError;
    public readonly payload: Error;

    constructor(error: Error) {
        this.payload = error;
    }
}