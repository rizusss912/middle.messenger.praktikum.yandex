import {component, CustomHTMLElement} from '../../utils/component';

import {template} from './app-input.tmpl';

import './app-input.less';
import {FormControl} from '../../utils/form/form-control';
import {Observable} from '../../utils/observeble/observeble';
import {ValidationErrorType} from '../../utils/form/validator-error';

@component<AppInput>({
	name: 'app-input',
	template,
})
export class AppInput implements CustomHTMLElement {
    public name: string | boolean;
    public formControl: FormControl | undefined;
    private input: HTMLInputElement;

    public onInit(): void {
    	this.name = this.formControl ? this.formControl.name : false;
    }

    public onRendered(element: HTMLElement): void {
    	this.input = element.querySelector('input');

    	if (this.formControl) {
    		this.formControl.$valueChanged.subscribe(value => {
    			this.input.value = value;
    		});
    	} else {
    		this.formControl = new FormControl({name: ''});
    	}
    }

    public get $hasErrors(): Observable<boolean> {
    	return this.formControl.$statusChanged.map(
        	status =>
    			status.errors
				&& status.errors.some(
					error => error.type === ValidationErrorType.shown,
				),
    	);
    }

    public get $errorMessage(): Observable<string> {
    	return this.formControl.$statusChanged.map(
        	status =>
    			status.errors?.find(error => error.type === ValidationErrorType.shown).message
				|| '',
    	);
    }

    public get $needHiddenErrors(): Observable<boolean> {
    	return Observable.all([this.$hasErrors, this.formControl.$touched])
    		.map(([hasErrors, touched]) => !hasErrors || !touched);
    }

    public onFocus(): void {
    	this.formControl.changeFocus(true);
    }

    public onBlur(): void {
    	this.formControl.changeFocus(false);
    	this.formControl.touch();
    }

    public onInput(event: InputEvent): void {
    	this.formControl.next((event.target as HTMLInputElement).value);
    }
}

