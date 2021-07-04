import {CustomElement} from './utils/custom-element.js';
import {template} from './app-root.tmpl.js';
import RouterService from './service/router/router.service.js';

import './app-root.less';

export default CustomElement({
    name: 'app-root',
    template, 
})(
    class AppRoot extends HTMLElement {
        router;

        constructor() {
            super();

            this.router = new RouterService();
        }

        connectedCallback() {
            const Page = this.router.getPageByPath(this.router.urlParams.pathname);
            this.render({content: [new Page()]});
        }
    }
)