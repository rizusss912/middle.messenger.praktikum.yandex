import {component, CustomHTMLElement} from '../../utils/component';
import {RouterService} from '../../service/router/router.service';

import {pages} from '../../service/router/pages.config';

import {template} from './page-main.tmpl';

import './page-main.less';
import {Subject} from '../../utils/observeble/subject';
import {Observable} from '../../utils/observeble/observeble';

@component<PageMain>({
	name: 'page-main',
	template,
})
export class PageMain implements CustomHTMLElement {
        private routerService: RouterService<{}>;
        private s: Subject<Date> = new Subject<Date>(new Date());
        private hidden: Subject<boolean> = new Subject<boolean>(false);
        public text = 'Шаблонизатор умеет получать значения из класса';

        constructor() {
        	this.routerService = new RouterService();
        }

        public onInit(): void {
        	setInterval(() => this.s.next(new Date()), 1000);
        	let f = 0;
        	setInterval(() => this.hidden.next(f++ % 2 === 0), 1000);
        }

        public get $data(): Observable<Date> {
        	return this.s.asObserveble();
        }

        public get $hidden(): Observable<boolean> {
        	return this.hidden.asObserveble();
        }

        public navigateToAuth(): void {
        	this.routerService.navigateTo(pages.auth);
        }

        public navigateToProfile(): void {
        	this.routerService.navigateTo(pages.profile);
        }
}
