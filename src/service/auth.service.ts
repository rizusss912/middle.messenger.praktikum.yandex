import { HTTPClientFacade } from "./api/http-client.facade";
import { AuthorizationData, RegistrationData } from "./api/modules/auth-http-client-module";

let instance: AuthService;

export class AuthService {
    private readonly httpClientFacade: HTTPClientFacade;

    constructor() {
        if (instance) return instance;

        instance = this;

        this.httpClientFacade = new HTTPClientFacade();
    }

    public authorization(authData: AuthorizationData): void {
		this.httpClientFacade.auth.authorization(authData)
            .then((e) => console.log('автризация:', e))
			.catch((e) => console.log('ошибка автризации:', e));
    }

    public registration(registrationData: RegistrationData): void {
        this.httpClientFacade.auth.authorization(registrationData)
            .catch((e) => console.log('автризация:', e));
    }
}