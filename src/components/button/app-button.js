import {CustomElement} from '../../utils/custom-element.js';

import {template} from './app-button.tmpl.js';

import './app-button.less';

export default CustomElement({
    name: 'app-button',
    template, 
})(
    class AppButton extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.render();
        }
    }
)