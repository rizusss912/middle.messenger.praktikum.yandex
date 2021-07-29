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
    public formControl: FormControl;
    private input: HTMLInputElement;

    public onInit(): void {
    	this.name = this.formControl ? this.formControl.name : false;
    }
	// TODO: Разбить на методы
    public onRendered(element: HTMLElement): void {
    	this.input = element.querySelector('input')!;

    	if (this.formControl) {
    		this.formControl.$valueChanged.subscribe(value => {
    			this.input.value = value || '';
    		});
    	} else {
    		this.formControl = new FormControl({name: ''});
    	}

		Observable.event(element, 'click').subscribe(() => this.setFocusForInput());

		this.formControl.$animations.subscribe(
			animation => element.animate(animation.keyFrames, animation.keyframeAnimationOptions),
		);
    }

	public get $hasFocus(): Observable<boolean> {
		return this.formControl.$changeFocus;
	}

    public get $hasErrors(): Observable<boolean> {
    	return this.formControl.$statusChanged.map(
        	status =>
    			Boolean(status?.errors)
				&& status!.errors!.some(
					error => error.type === ValidationErrorType.shown,
				),
    	);
    }

	public get $disabled(): Observable<boolean> {
		return this.formControl.$disabled;
	}

    public get $errorMessage(): Observable<string> {
    	return this.formControl.$statusChanged
			.map(
				status =>
					status.errors?.find(error => error.type === ValidationErrorType.shown)?.message
					|| '',
			)
			// WARNING: Благодаря этому, текст ошибки не исчезает мгновенно,
			// а становится прозрачным c анимацией.
			.filter(message => Boolean(message));
    }

    public get $needHiddenErrors(): Observable<boolean> {
    	return Observable.all([
				this.$hasErrors,
				this.formControl.$touched,
				this.formControl.$disabled,
			])
    		.map(([hasErrors, touched, disabled]) => !hasErrors || !touched || disabled);
    }

	public get $inputStatus(): Observable<string> {
		return Observable.all([
				this.$hasErrors,
				this.formControl.$changeFocus,
				this.formControl.$touched,
				this.formControl.$disabled,
			])
			.map(([hasErrors, hasFocus, touched, disabled]) => {
				if (disabled) return 'disabled';
				if (!touched) return hasFocus ? 'focus' : '';
				if (hasErrors) return 'error';
				if (hasFocus) return 'focus';

				return 'valid';
			})
			.uniqueNext(true);
	}

	public get $labelIsInsteadOfText(): Observable<boolean> {
		return Observable.all([
				this.formControl.$changeFocus,
				this.formControl.$valueChanged.map(value => Boolean(value)),
			])
			.map(([hasFocus, hasValue]) => !hasFocus && !hasValue);
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

	public setFocusForInput(): void {
		this.input.focus();
	}
}

