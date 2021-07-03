import {CustomElement} from '../../utils/custom-element.js';
import RouterService from '../../service/router.service.js';

import {template} from './page-auth.tmpl.js';

import './page-auth.less';

export default CustomElement({
    name: 'page-auth',
    template, 
})(
    class PageAuth extends HTMLElement {
        router;

        constructor() {
            super();

            this.router = new RouterService();
        }

        connectedCallback() {
            this.render();
        }

        navigateToDefault() {
            this.router.navigateTo("/");
        }
    }
)