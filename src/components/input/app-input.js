import {CustomElement} from '../../utils/custom-element.js';

import {template} from './app-input.tmpl.js';

import './app-input.less';

export default CustomElement({
    name: 'app-input',
    template, 
})(
    class AppInput extends HTMLElement {
        name;

        constructor() {
            super();
        }

        connectedCallback() {
            this.name = this.getAttribute("name");
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