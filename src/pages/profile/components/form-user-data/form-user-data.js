import {CustomElement} from '../../../../utils/custom-element.js';

import {template} from './form-user-data.tmpl.js';

import RouterService from '../../../../service/router/router.service.js';
import {pages} from '../../../../service/router/pages.config.js';

import '../../../../components/form/app-form.js';
import '../../../../components/input/app-input.js';
import '../../../../components/button/app-button.js';

import './form-user-data.less';

export default CustomElement({
    name: 'form-user-data',
    template, 
})(
    class FormUserData extends HTMLElement {
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

        onChangeData() {
            console.log("смена пользовательских данных");
        }
    }
)