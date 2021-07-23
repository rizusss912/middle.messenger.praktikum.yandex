import {Templator} from '../utils/templator.js';

//TODO: прокинуть Callback об изменении роута
export function CustomElement(config) {
    return function(clazz) {

        clazz.prototype.init = function(options) {
            this.templator = new Templator(config.template);

            for (var node of this.templator.nodes) {
                this.appendChild(node);
            }

            this.templator.render(this, options);
        }

        clazz.prototype.render = function(options) {
            if (!this.templator) {
                this.init(options);
            } else {
                this.templator.render(this, options);
            }
        }

        customElements.define(config.name, clazz, config.options);

        return clazz;
    }
}