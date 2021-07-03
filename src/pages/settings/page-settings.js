import {CustomElement} from '../../utils/custom-element.js';
import RouterService from '../../service/router/router.service.js';

import {template} from './page-settings.tmpl.js';

import './page-settings.less';

export default CustomElement({
    name: 'page-settings',
    template, 
})(
    class PageSettings extends HTMLElement {
        router;

        constructor() {
            super();

            this.router = new RouterService();
        }

        connectedCallback() {
            this.render();
        }

        navigateToAuth() {
            console.log(this);
            this.router.navigateTo("/auth");
        }
    }
)