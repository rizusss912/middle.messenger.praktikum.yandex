import {authorizationActionType} from '../enums/authorization-action-type.enum';
import {Action} from '../interfaces/action.interface';
import {authToken, logout, userData} from '../interfaces/authorization-state.interface';

export class UploadAuthTokenAction implements Action {
    public readonly type = authorizationActionType.authTokenUpload;
}

export class UploadedAuthTokenAction implements Action {
    public readonly type = authorizationActionType.authTokenUploaded;
    public readonly payload: authToken = undefined;
}

export class UploadErrorAuthTokenAction implements Action {
    public readonly type = authorizationActionType.userDataUploadError;
    public readonly payload: Error;

    constructor(error: Error) {
    	this.payload = error;
    }
}

export class UploadLogoutAction implements Action {
    public readonly type = authorizationActionType.logoutUpload;
}

export class UploadedLogoutAction implements Action {
    public readonly type = authorizationActionType.logoutUploaded;
    public readonly payload: logout = undefined;
}

export class UploadErrorLogoutAction implements Action {
    public readonly type = authorizationActionType.logoutUploadError;
    public readonly payload: Error;

    constructor(error: Error) {
    	this.payload = error;
    }
}

export class UploadUserDataAction implements Action {
    public readonly type = authorizationActionType.userDataUpload;
}

export class UploadedUserDataAction implements Action {
    public readonly type = authorizationActionType.userDataUploaded;
    public readonly payload: userData;

    constructor(data: userData) {
    	this.payload = data;
    }
}

export class UploadErrorUserDataAction implements Action {
    public readonly type = authorizationActionType.userDataUploadError;
    public readonly payload: Error;

    constructor(error: Error) {
    	this.payload = error;
    }
}
