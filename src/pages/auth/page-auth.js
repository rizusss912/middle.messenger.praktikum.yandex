import {CustomElement} from '../../utils/custom-element.js';

import RouterService from '../../service/router/router.service.js';
import {pages} from '../../service/router/pages.config.js';

import '../../components/input/app-input.js';
import '../../components/button/app-button.js';

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

        navigateToMain() {
            this.router.navigateTo(pages.main);
        }

        get title() {
            return this.isRegistration ? "Регистрация" : "Вход";
        }

        get isRegistration() {
            return this.router.urlParams.queryParams.type === "registration";
        }

        get isAuthorization() {
            return !this.isRegistration;
        }
    }
)