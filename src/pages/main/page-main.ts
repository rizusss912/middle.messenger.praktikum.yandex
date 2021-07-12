import {Component, CustomHTMLElement} from '../../utils/component';
import {RouterService} from '../../service/router/router.service';

import {pages} from '../../service/router/pages.config';

import {template} from './page-main.tmpl';

import './page-main.less';
import { Subject } from '../../utils/observeble/subject';
import { Observable } from '../../utils/observeble/observeble';

@Component<PageMain>({  
    name: 'page-main',
    template, 
})
export class PageMain implements CustomHTMLElement {
        private routerService: RouterService<{}>;
        private s: Subject<number> = new Subject<number>();
        public value = 'test';

        constructor() {
            this.routerService = new RouterService();
        }

        onInit(): void {
            var x = 0;
            setInterval(() => this.s.next(x++), 1000);
        }

        get $value(): Observable<number> {
            return this.s.asObserveble();
        }

        navigateToAuth(): void {
            this.routerService.navigateTo(pages.auth);
        }

        navigateToProfile(): void {
            this.routerService.navigateTo(pages.profile);
        }
    }