import {AuthApiModule} from './modules/auth-api-module';

let instance: HTTPClientFacade;

export class HTTPClientFacade {
    public readonly auth: AuthApiModule;

    private readonly mutualPathname = ['api'];
    private readonly origin = 'https://yandex.ru';

    constructor() {
    	if (instance) {
    		return instance;
    	}

    	instance = this;

    	this.auth = new AuthApiModule(this.origin, this.mutualPathname);
    }
}
