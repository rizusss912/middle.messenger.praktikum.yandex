import {Component, CustomHTMLElement} from '../../utils/component';
import {RouterService} from '../../service/router/router.service';

import {pages} from '../../service/router/pages.config';

import {template} from './page-main.tmpl';

import './page-main.less';

@Component<PageMain>({  
    name: 'page-main',
    template, 
})
export class PageMain implements CustomHTMLElement {
        routerService: RouterService<{}>;

        constructor() {
            this.routerService = new RouterService();
        }

        onInit(): void {}

        navigateToAuth(): void {
            this.routerService.navigateTo(pages.auth);
        }

        navigateToProfile(): void {
            this.routerService.navigateTo(pages.profile);
        }
    }