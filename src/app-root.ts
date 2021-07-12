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

    onInit(): void {
        const subject = new Subject<number>();
        var v = 0;
        setInterval(() => subject.next(v++), 1000);
        subject.asObserveble()
            .map(v => v * v)
            .filter(v => v % 2 === 0)
            .only(5)
            .subscribe(console.log); // 0, 4, 16, 36, 64
    }

    get content(): Observable<HTMLElement[]> {
        return this.router.$path
            .map(pathname => this.router.getPageByPath(pathname))
            //.startWith(this.router.getPage())
            //TODO: Проблема с типизацией. HTMLPage !== HTMLElement (
            .map(constructor => [new constructor() as unknown as HTMLElement]);
    }
}
