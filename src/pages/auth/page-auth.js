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

        get title() {
            return this.isRegistration ? "Регистрация" : "Вход";
        }

        get isRegistration() {
            return this.router.urlParams.queryParams.type === "registration";
        }

        get isAuthorization() {
            return !this.isRegistration;
        }

        connectedCallback() {
            this.render();
        }

        navigateTo() {
            if (this.isAuthorization) {
                this.router.navigateTo(pages.auth, {type: "registration"});
            } else {
                this.router.navigateTo(pages.auth);
            }
        }

        onAuthorization() {
            console.log(this.isAuthorization ? "авторизация": "регистрация");
            if (this.isAuthorization) {
                //TODO: собираем с формочки данные авторизации и идём на сервер
            } else {
                //TODO: собираем с формочки данные регистрации и идём на сервер
            }
        }
    }
)