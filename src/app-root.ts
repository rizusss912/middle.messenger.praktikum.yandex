import {component, CustomHTMLElement} from './utils/component';
import {template} from './app-root.tmpl';
import {RouterService} from './service/router/router.service';
import {Observable} from './utils/observeble/observeble';

import {HTMLPageConstructor} from './service/router/router.config';

import './app-root.less';

@component<AppRoot>({
	name: 'app-root',
	template,

})
export class AppRoot implements CustomHTMLElement {
    private readonly router: RouterService<{}>;

    constructor() {
    	this.router = new RouterService();
    }

    public onInit(): void {}

    public get content(): Observable<HTMLElement[]> {
    	return this.router.$path
    		.map(pathname => this.router.getPageByPath(pathname))
    		// TODO: Проблема с типизацией. HTMLPage !== HTMLElement (
    		.map(
    			(constructor: HTMLPageConstructor) => [new constructor() as unknown as HTMLElement],
    		);
    }
}
