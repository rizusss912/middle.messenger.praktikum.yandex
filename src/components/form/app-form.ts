import {component, CustomHTMLElement} from '../../utils/component';

import {template} from './app-form.tmpl';

import './app-form.less';
import {FormGroup} from '../../utils/form/form-group';
import {Observable} from '../../utils/observeble/observeble';

@component({
	name: 'app-form',
	template,
	observedAttributes: ['name'],
})
export class AppForm implements CustomHTMLElement {
    public name: string;
    public formGroup: FormGroup<{}> | undefined;

    public onSubmit(event: Event): void {
    	event.preventDefault();

    	if (!this.formGroup) {
    		return;
    	}

    	Observable.all([this.formGroup.$isValid, this.formGroup.$valueChanged])
    		.only(1)
    		.filter(([isValid, _value]) => Boolean(isValid))
    		.on(([_isValid, value]) => this.formGroup?.submit(value));
    }

    public onAttributeChanged(
    	name: string,
    	_oldValue: string | null,
    	newValue: string | null,
    ): boolean {
    	switch (name) {
    		case 'name':
    			if (newValue) {
    				this.name = newValue;
    			}

    			break;
    		default: break;
    	}

    	return false;
    }
}
