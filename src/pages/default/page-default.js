import {CustomElement} from '../../utils/custom-element.js';
import RouterService from '../../service/router/router.service.js';

import {template} from './page-default.tmpl.js';

import './page-default.less';

export default CustomElement({
    name: 'page-default',
    template, 
})(
    class PageDefault extends HTMLElement {
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