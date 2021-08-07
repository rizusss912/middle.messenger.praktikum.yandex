import {component, CustomHTMLElement} from '../../utils/component';
import {RouterService} from '../../service/router/router.service';

import {pages} from '../../service/router/pages.config';

import {template} from './page-main.tmpl';

import './page-main.less';
import { AuthGuard } from '../../utils/guard/auth-guard';

@component({
	name: 'page-main',
	template,
        guards: [AuthGuard],
})
export class PageMain implements CustomHTMLElement {
        private routerService: RouterService<{}>;

        constructor() {
        	this.routerService = new RouterService();
        }

        public onInit(): void {
        }

        public navigateToAuth(): void {
        	this.routerService.navigateTo(pages.auth);
        }

        public navigateToProfile(): void {
        	this.routerService.navigateTo(pages.profile);
        }
}
