import {Component, CustomHTMLElement} from './utils/component';
import {template} from './app-root.tmpl';
import {RouterService, urlParams} from './service/router/router.service';

import {Subject} from './utils/observeble/subject';
import {Observable} from './utils/observeble/observeble';


import './app-root.less';
@Component<AppRoot>({
    name: 'app-root',
    template,

})
export class AppRoot implements CustomHTMLElement {
    private readonly router: RouterService<{}>;
    private readonly _content: Subject<urlParams<{}>> = new Subject<urlParams<{}>>();

    constructor() {
        this.router = new RouterService();
    }

    onInit(): void {}

    get content(): Observable<HTMLElement[]> {
        return this.router.$path
            .map(pathname => this.router.getPageByPath(pathname))
            //TODO: Проблема с типизацией. HTMLPage !== HTMLElement (
            .map(constructor => [new constructor() as unknown as HTMLElement]);
    }
}
