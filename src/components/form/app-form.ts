import {component, CustomHTMLElement} from '../../utils/component';

import {template} from './app-form.tmpl';

import './app-form.less';
import {FormGroup} from '../../utils/form/form-group';
import {Observable} from '../../utils/observeble/observeble';
import {Subject} from '../../utils/observeble/subject';

@component({
	name: 'app-form',
	template,
	observedAttributes: ['name'],
})
export class AppForm implements CustomHTMLElement {
    private _$name: Subject<string | boolean> = new Subject<string | boolean>();
    public formGroup: FormGroup<{}> | undefined;

    public get $name(): Observable<string | boolean> {
    	return this._$name.asObserveble();
    }

    public onSubmit(event: Event): void {
    	event.preventDefault();

    	if (!this.formGroup) {
    		return;
    	}

    	Observable.all([this.formGroup.$isValid, this.formGroup.$valueChanged])
    		.only(1)
    		.filter(([isValid]) => Boolean(isValid))
    		.on(args => this.formGroup?.submit(args[1]));
    }

    public onAttributeChanged(
    	name: string,
    	_oldValue: string | null,
    	newValue: string | null,
    ): boolean {
    	switch (name) {
    		case 'name':
    			if (newValue) {
    				this._$name.next(newValue);
    			} else {
    				this._$name.next(false);
    			}

    			break;
    		default: break;
    	}

    	return false;
    }
}
