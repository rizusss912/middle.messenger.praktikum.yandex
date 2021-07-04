import {CustomElement} from '../../utils/custom-element.js';
import RouterService from '../../service/router/router.service.js';

import {template} from './page-profile.tmpl.js';

import './page-profile.less';

export default CustomElement({
    name: 'page-profile',
    template, 
})(
    class PageProfile extends HTMLElement {
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