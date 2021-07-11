import {Component, CustomHTMLElement} from '../../utils/component';

import {template} from './app-form.tmpl';

import './app-form.less';

@Component<AppForm>({
    name: 'app-form',
    template,
    observedAttributes: ['name'],
})
export class AppForm implements CustomHTMLElement {
        name: string;

        onAttributeChanged(name: string, oldValue: string | null, newValue: string | null): boolean {
            if (name === "name" && oldValue !== newValue) {
                this.name = newValue;

                return true;
            }

            return false;
        }
    }
