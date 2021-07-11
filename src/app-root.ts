import {Component, CustomHTMLElement} from './utils/component';
import {template} from './app-root.tmpl';
import {RouterService} from './service/router/router.service';

import './app-root.less';

@Component<AppRoot>({
    name: 'app-root',
    template,
})
export class AppRoot implements CustomHTMLElement {
    private readonly router: RouterService<{}>;

    constructor() {
        this.router = new RouterService();
    }

    onInit(): void {}

    get content(): HTMLElement[] {
        const page = this.router.getPage();

        return [new page() as unknown as HTMLElement];
    }
}
