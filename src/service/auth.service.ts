import {
	UploadAuthTokenAction,
	UploadedAuthTokenAction,
	UploadedLogoutAction,
	UploadedUserDataAction,
	UploadErrorAuthTokenAction,
	UploadErrorLogoutAction,
	UploadErrorUserDataAction,
	UploadLogoutAction,
	UploadUserDataAction} from '../store/actions/authorization.actions';
import {dataStatus} from '../store/enums/data-status.enum';
import {selectIsAuthorized} from '../store/selectors/authorization/select-is-authorized';
import {selectUserData} from '../store/selectors/authorization/select-user-data';
import {selectDataStatus} from '../store/selectors/data/select-status';
import {Store} from '../store/store';
import {HTTPClientFacade} from './api/http-client.facade';
import {authorizationData, registrationData} from './api/modules/auth-http-client-module';

let instance: AuthService;

export class AuthService {
    private readonly httpClientFacade: HTTPClientFacade;
    private readonly store: Store;

    constructor() {
    	if (instance) {
    		return instance;
    	}

    	instance = this;

    	this.httpClientFacade = new HTTPClientFacade();
    	this.store = new Store();
    }

    public authorization(authData: authorizationData): Promise<void> {
    	return (
    		selectIsAuthorized(this.store.state)
    			? this.logout().catch()
    			: Promise.resolve()
    	)
    		.then(() => this.store.dispatch(new UploadAuthTokenAction()))
    		.then(() => this.httpClientFacade.auth.authorization(authData))
    		.then(() => this.store.dispatch(new UploadedAuthTokenAction()))
    		.catch(error => {
    			this.store.dispatch(new UploadErrorAuthTokenAction(error));

    			throw error;
    		});
    }

    public registration(registrationData: registrationData): Promise<void> {
    	return (
    		selectIsAuthorized(this.store.state)
    			? this.logout().catch()
    			: Promise.resolve()
    	)
    		.then(() => this.store.dispatch(new UploadAuthTokenAction()))
    		.then(() => this.httpClientFacade.auth.registration(registrationData))
    		.then(() => this.store.dispatch(new UploadedAuthTokenAction()))
    		.catch(error => {
    			this.store.dispatch(new UploadErrorAuthTokenAction(error));

    			throw error;
    		});
    }

    public logout(): Promise<void> {
    	this.store.dispatch(new UploadLogoutAction());

    	return this.httpClientFacade.auth.logout()
    		.then(() => this.store.dispatch(new UploadedLogoutAction()))
    		.catch(error => {
    			this.store.dispatch(new UploadErrorLogoutAction(error));

    			throw error;
    		});
    }

    public uploadUserData(): Promise<void> {
    	this.store.dispatch(new UploadUserDataAction());

    	return this.httpClientFacade.auth.getUserData()
    		.then(response => this.store.dispatch(new UploadedUserDataAction(response.body)))
    		.catch(error => {
    			this.store.dispatch(new UploadErrorUserDataAction(error));

    			throw error;
    		});
    }

    public uploadUserDataIfNot(): Promise<void> {
    	return selectDataStatus(selectUserData(this.store.state)) === dataStatus.valid
    		? Promise.resolve()
    		: this.uploadUserData();
    }
}
