import {CustomElement} from '../../utils/custom-element.js';
import RouterService from '../../service/router/router.service.js';

import { pages } from '../../service/router/pages.config.js';

import {template} from './page-main.tmpl.js';

import './page-main.less';

export default CustomElement({
    name: 'page-main',
    template, 
})(
    class PageMain extends HTMLElement {
        router;

        constructor() {
            super();

            this.router = new RouterService();
        }

        connectedCallback() {
            this.render();
        }

        navigateToAuth() {
            this.router.navigateTo(pages.auth);
        }

        navigateToProfile() {
            this.router.navigateTo(pages.profile);
        }
    }
)