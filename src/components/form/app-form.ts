import {component, CustomHTMLElement} from '../../utils/component';

import {template} from './app-form.tmpl';

import './app-form.less';
import {FormGroup} from '../../utils/form/form-group';

@component<AppForm>({
	name: 'app-form',
	template,
	observedAttributes: ['name'],
})
export class AppForm implements CustomHTMLElement {
    public name: string;
    public formGroup: FormGroup<{}> | undefined;

    public onAttributeChanged(
    	name: string, oldValue: string | null, newValue: string | null): boolean {
    	if (name === 'name' && oldValue !== newValue) {
        	this.name = newValue;

        	return true;
    	}

    	return false;
    }
}
