import {CustomElement} from '../../../../utils/custom-element.js';

import {template} from './form-password.tmpl.js';

import RouterService from '../../../../service/router/router.service.js';
import {pages} from '../../../../service/router/pages.config.js';

import './form-password.less';

export default CustomElement({
    name: 'form-password',
    template, 
})(
    class FormPassword extends HTMLElement {
        routerService;

        constructor() {
            super();

            this.routerService = new RouterService();
        }

        connectedCallback() {
            this.render();
        }

        static get observedAttributes() {
            return ["hidden"];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === "hidden" && oldValue !== newValue) {
                if (newValue === "true") {
                    this.style.display = "none";
                } else {
                    this.style.display = "block";
                    this.render();
                }
            }
        }

        onBack() {
            this.routerService.navigateTo(pages.profile);
        }

        onChangePassword() {
            console.log('Смена пароля');
        }
    }
)