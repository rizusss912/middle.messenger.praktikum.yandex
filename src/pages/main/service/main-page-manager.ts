import {AuthService} from '../../../service/auth.service';
import {pages} from '../../../service/router/pages.config';
import {RouterService} from '../../../service/router/router.service';

let instance: MainPageManager;

export class MainPageManager {
    private readonly routerService: RouterService<{}>;
    private readonly authService: AuthService;
    //private readonly activeChatsService: ActiveChatsService;

    constructor() {
    	if (instance) {
    		return instance;
    	}

    	instance = this;

    	this.routerService = new RouterService();
    	this.authService = new AuthService();
    	//this.activeChatsService = new ActiveChatsService();
    }

    public navigateToAuth(): void {
    	this.routerService.navigateTo(pages.auth);
    }

    public navigateToProfile(): void {
    	this.routerService.navigateTo(pages.profile);
    }

    public logout(): void {
    	this.authService.logout()
    		.catch()
    		.then(() => this.navigateToAuth());
    }
}
