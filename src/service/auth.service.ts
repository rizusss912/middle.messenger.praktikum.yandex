import { UploadedUserDataAction, UploadErrorUserDataAction, UploadUserDataAction } from "../store/actions/authorization.actions";
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

    public async authorization(authData: AuthorizationData): Promise<void> {
        this.store.dispatch(new UploadUserDataAction());

		await this.httpClientFacade.auth.authorization(authData)
            .then(() => this.httpClientFacade.auth.getUserData())
            .then(response => this.store.dispatch(new UploadedUserDataAction(response.body)))
            .catch(() => this.logout())
			.catch(error => this.store.dispatch(new UploadErrorUserDataAction(error)));
    }

    public async registration(registrationData: RegistrationData): Promise<void> {
        this.store.dispatch(new UploadUserDataAction());

        await this.httpClientFacade.auth.registration(registrationData)
            .then(() => this.httpClientFacade.auth.getUserData())
            .then(response => this.store.dispatch(new UploadedUserDataAction(response.body)))
			.catch(error => this.store.dispatch(new UploadErrorUserDataAction(error)));
    }

    public async logout(): Promise<void> {
        await this.httpClientFacade.auth.logout();
    }
}