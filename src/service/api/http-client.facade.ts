import { AuthInterceptor } from '../../interceptor/auth-interceptor';
import { AuthHTTPClientModule } from './modules/auth-http-client-module';

let instance: HTTPClientFacade;

export class HTTPClientFacade {
    public readonly auth: AuthHTTPClientModule;

    private readonly mutualPathname = ['api', 'v2'];
    private readonly origin = ' https://ya-praktikum.tech';
    private readonly interseptors = [
        new AuthInterceptor(),
    ];

    constructor() {
    	if (instance) {
    		return instance;
    	}

    	instance = this;



    	this.auth = new AuthHTTPClientModule(this.origin, this.mutualPathname, this.interseptors);
    }
}
