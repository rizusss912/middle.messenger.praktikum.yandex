import {Component, CustomHTMLElement} from '../../utils/component';

import {template} from './app-input.tmpl';

import './app-input.less';

@Component<AppInput>({
    name: 'app-input',
    template,
    observedAttributes: ['name'],
})
export class AppInput implements CustomHTMLElement {
        name: string;

        onAttributeChanged(name: string, oldValue: string | null, newValue: string | null): boolean {
            if (name === "name" && oldValue !== newValue) {
                this.name = newValue;

                return true;
            }

            return false;
        }
    }
