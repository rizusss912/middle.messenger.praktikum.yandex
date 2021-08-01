import { UploadedUserDataAction, UploadErrorUserDataAction, UploadUserDataAction } from "../store/actions/user-data.actions";
import { Store } from "../store/store";
import { HTTPClientFacade } from "./api/http-client.facade";
import { AuthorizationData, RegistrationData } from "./api/modules/auth-http-client-module";

let instance: AuthService;

export class AuthService {
    private readonly httpClientFacade: HTTPClientFacade;
    private readonly store: Store;

    constructor() {
        if (instance) return instance;

        instance = this;

        this.httpClientFacade = new HTTPClientFacade();
        this.store = new Store();
    }

    public authorization(authData: AuthorizationData): void {
        this.store.dispatch(new UploadUserDataAction());

		this.httpClientFacade.auth.authorization(authData)
            .then(() => this.httpClientFacade.auth.getUserData())
            .then(response => this.store.dispatch(new UploadedUserDataAction(response.body)))
			.catch(error => this.store.dispatch(new UploadErrorUserDataAction(error)));
    }

    public registration(registrationData: RegistrationData): void {
        this.store.dispatch(new UploadUserDataAction());

        this.httpClientFacade.auth.registration(registrationData)
            .then(() => this.httpClientFacade.auth.getUserData())
            .then(response => this.store.dispatch(new UploadedUserDataAction(response.body)))
			.catch(error => this.store.dispatch(new UploadErrorUserDataAction(error)));
    }

    public logoout(): void {

    }
}