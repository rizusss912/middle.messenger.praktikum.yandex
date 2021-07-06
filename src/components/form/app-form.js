import {CustomElement} from '../../utils/custom-element.js';

import {template} from './app-form.tmpl.js';

import './app-form.less';

export default CustomElement({
    name: 'app-form',
    template, 
})(
    class AppForm extends HTMLElement {
        name;

        constructor() {
            super();
        }

        connectedCallback() {
            this.render();
        }

        static get observedAttributes() {
            return ["name"];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === "name" && oldValue !== newValue) {
                this.name = newValue;
                this.render();
            }
        }
    }
)