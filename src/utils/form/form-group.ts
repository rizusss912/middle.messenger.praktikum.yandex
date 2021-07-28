import {ShakingAnimation} from '../animation/animations/shaking-animation';
import {Observable} from '../observeble/observeble';
import { Subject } from '../observeble/subject';
import {FormControl, FormControlOptions, FormStatusType, formValue} from './form-control';
import {ValidatorError} from './validator-error';

type formStatus<Form> = {
	status: FormStatusType.invalid;
	errors: {[key in keyof Form]: ValidatorError[]};
}
| {
	status: FormStatusType.valid;
};

export interface FormGroupConfig<Form extends {[key: string]: formValue}> {
    controls?: Record<keyof Form, FormControlOptions>;
}

export class FormGroup<Form extends {[key: string]: formValue}> {
    public readonly controls: Record<keyof Form, FormControl>;

	private readonly _$submit: Subject<Record<keyof Form, formValue>> = new Subject<Record<keyof Form, formValue>>();

    constructor(config: FormGroupConfig<Form>) {
    	const controls = {} as Record<keyof Form, FormControl>;

    	if (config.controls) {
    		for (const name of Object.keys(config.controls)) {
    			controls[name as keyof Form] = new FormControl({name, ...config.controls[name]});
    		}
    	}

    	this.controls = controls;
    }

    get value(): Record<keyof Form, formValue> {
    	return Object.values(this.controls).reduce((out, control) => {
    		(out[control.name] as keyof Form) = String(control.value);

    		return out;
    	}, {} as Record<keyof Form, formValue>);
    }

	public get $submit(): Observable<Record<keyof Form, formValue>> {
		return this._$submit.asObserveble();
	}

    public get $valueChanged(): Observable<Form> {
    	return Observable.concat(
    		Object.values(this.controls).map(control =>
    			control.$valueChanged
    				.map(value => ({value, name: control.name})),
    		),
    	).map(entrys => entrys.reduce((out, entry) => {
			if (entry) {
    			(out[entry.name] as keyof Form) = String(entry.value);
			}

    		return out;
    	}, {} as Form));
    }

    public get $statusChanged(): Observable<formStatus<Form>> {
    	return Observable.concat(
    		Object.values(this.controls).map(control =>
    			control.$statusChanged
    				.map(status => ({...status, name: control.name})),
    		),
    	).map(statuses => {
    		const isValid = statuses.every(status => status!.status === FormStatusType.valid);

    		if (isValid) {
    			return {status: FormStatusType.valid};
    		}

    		const errors = statuses.reduce((out, status) => {
    			if (status && status.errors) {
    				out[status.name as keyof Form] = status.errors;
    			}

    			return out;
    		}, {} as {[key in keyof Form]: ValidatorError[]});

    		return {status: FormStatusType.invalid, errors};
    	});
    }

    public get $isValid(): Observable<boolean> {
    	return Observable.concat(Object.values(this.controls).map(control => control.$isValid))
    		.map(isValidFieldsArray => isValidFieldsArray.every(isValid => isValid));
    }

    public touch(): void {
    	for (const control of Object.values(this.controls)) {
    		control.touch();
    	}
    }

	public disable(disabled: boolean): void {
    	for (const control of Object.values(this.controls)) {
    		control.disable(disabled);
    	}
	}

	public submit(value: Record<keyof Form, formValue>): void {
		this._$submit.next(value);
	}

	public shakingFirstInvalidField(): void {
		Observable.all(
			Object.values(this.controls)
				.map(control => control.$isValid.map(isValid => ({isValid, name: control.name}))),
		)
		.only(1)
		.subscribe(isValidObjArray => {
			const firstInvalidControlsName = isValidObjArray.find(isValidObj => !isValidObj.isValid)?.name;

			if (firstInvalidControlsName) {
				this.controls[firstInvalidControlsName].animate([[new ShakingAnimation()]]);
			}
		});
	}
}
