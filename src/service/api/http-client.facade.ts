import { AuthHTTPClientModule } from './modules/auth-http-client-module';

let instance: HTTPClientFacade;

export class HTTPClientFacade {
    public readonly auth: AuthHTTPClientModule;

    private readonly mutualPathname = ['api', 'v2'];
    private readonly origin = ' https://ya-praktikum.tech';

    constructor() {
    	if (instance) {
    		return instance;
    	}

    	instance = this;

    	this.auth = new AuthHTTPClientModule(this.origin, this.mutualPathname);
    }
}
