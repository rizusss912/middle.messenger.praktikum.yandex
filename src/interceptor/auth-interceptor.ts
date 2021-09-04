import {pages} from '../service/router/pages.config';
import {RouterService} from '../service/router/router.service';
import {Interceptor} from '../utils/interfaces/interceptor';

export class AuthInterceptor implements Interceptor {
    private readonly routerService: RouterService<{}>;

    constructor() {
    	this.routerService = new RouterService();
    }

    public interceptRequest(request: XMLHttpRequest) {
    	if (request.status === 401) {
    		this.routerService.navigateTo(pages.auth);
    	}
    }
}
