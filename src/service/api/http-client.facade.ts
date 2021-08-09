import { AuthInterceptor } from '../../interceptor/auth-interceptor';
import { AuthHTTPClientModule } from './modules/auth-http-client-module';
import { ChatsHttpClientModule } from './modules/chats-http-client-module';
import { UserHTTPClientModule } from './modules/user-http-client-module';

let instance: HTTPClientFacade;

export const API_SERVER = 'ya-praktikum.tech';

export class HTTPClientFacade {
    public readonly auth: AuthHTTPClientModule;
    public readonly user: UserHTTPClientModule;
    public readonly chats: ChatsHttpClientModule;

    private readonly mutualPathname = ['api', 'v2'];
    private readonly origin = `https://${API_SERVER}`;
    private readonly interseptors = [
        new AuthInterceptor(),
    ];

    constructor() {
    	if (instance) {
    		return instance;
    	}

    	instance = this;

    	this.auth = new AuthHTTPClientModule(this.origin, this.mutualPathname, this.interseptors);
        this.user = new UserHTTPClientModule(this.origin, this.mutualPathname, this.interseptors);
        this.chats = new ChatsHttpClientModule(this.origin, this.mutualPathname, this.interseptors);
    }
}
