import {Templator} from '../utils/templator.js';

export function CustomElement(config) {
    return function(clazz) {
        var templator = new Templator(config.template);

        clazz.prototype.render = function () {
            if (!templator.isAppend) {
                templator.isAppend = true;

                for (var node of templator.nodes) {
                    this.append(node);
                }
            }

            templator.render(this);
        }

        customElements.define(config.name, clazz, config.options);

        return clazz;
    }
}