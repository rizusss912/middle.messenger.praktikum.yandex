import {CustomElement} from '../../utils/custom-element.js';
import RouterService from '../../service/router/router.service.js';

import {template} from './page-error.tmpl.js';

import './page-error.less';

export default CustomElement({
    name: 'page-error',
    template, 
})(
    class PageError extends HTMLElement {
        router;

        constructor() {
            super();

            this.router = new RouterService();
        }

        connectedCallback() {
            this.render();
        }

        navigateToAuth() {
            this.router.navigateTo("/auth");
        }
    }
)