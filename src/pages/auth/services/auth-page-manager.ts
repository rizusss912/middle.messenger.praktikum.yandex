
import {authorizationData, registrationData} from '../../../service/api/modules/auth-http-client-module';
import {AuthService} from '../../../service/auth.service';
import {pages} from '../../../service/router/pages.config';
import {RouterService} from '../../../service/router/router.service';
import {Observable} from '../../../utils/observeble/observeble';
import {authPageType} from '../enums/auth-page-type.enum';

type authPageQueryParams = {
    type?: authPageType,
}

let instance: AuthPageManager;

export class AuthPageManager {
    private readonly routerService: RouterService<authPageQueryParams>;
    private readonly authService: AuthService;

    constructor() {
    	if (instance) {
    		return instance;
    	}

    	instance = this;

    	this.routerService = new RouterService();
    	this.authService = new AuthService();
    }

    public get $isRegistration(): Observable<boolean> {
    	return this.routerService.$queryParams.map(query =>
    		query.type === authPageType.registration,
    	);
    }

    public navigateToAuthorization(): void {
    	this.routerService.navigateTo(pages.auth, {type: authPageType.registration});
    }

    public navigateToRegistration(): void {
    	this.routerService.navigateTo(pages.auth);
    }

    public authorization(authData: authorizationData): void {
    	this.authService.authorization(authData)
    		.then(() => this.navigateToChats());
    }

    public registration(registrationData: registrationData): void {
    	this.authService.registration(registrationData)
    		.then(() => this.navigateToChats());
    }

    private navigateToChats(): void {
    	this.routerService.navigateTo(pages.chats);
    }
}
