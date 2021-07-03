import {CustomElement} from './utils/custom-element.js';
import {template} from './app-root.tmpl.js';
import './app-root.less';

CustomElement({
    name: 'app-root',
    template, 
})(
    class AppRoot extends HTMLElement {
        constructor() {
            super();
            this.text = 'fff';
        }

        connectedCallback() {
            //this.attachShadow({mode: 'open'});
            this.render();
        }
    }
)