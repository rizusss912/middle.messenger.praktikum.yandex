import {component, CustomHTMLElement} from '../../utils/component';
import {template} from './page-main.tmpl';

import './page-main.less';
import { AuthGuard } from '../../guards/auth-guard';
import { MainPageManager } from './service/main-page-manager';

@component({
	name: 'page-main',
	template,
        guards: [AuthGuard],
})
export class PageMain implements CustomHTMLElement {
        private readonly mainPageManager: MainPageManager;

        constructor() {
                this.mainPageManager = new MainPageManager();
        }

        public onInit(): void {
        }

        public navigateToAuth(): void {
        	this.mainPageManager.navigateToAuth();
        }

        public navigateToProfile(): void {
                this.mainPageManager.navigateToProfile();
        }

        public logout(): void {
                this.mainPageManager.logout();
        }
}
