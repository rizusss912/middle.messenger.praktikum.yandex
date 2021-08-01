import {AppAnimation} from '../animation/app-animation';
import {Observable} from '../observeble/observeble';
import {Subject} from '../observeble/subject';
import {ValidatorError} from './validator-error';

export type formValue = unknown;

export type formValidator = (value: formValue) => null | ValidatorError;
export type asyncFormValidator =
	($value: Observable<formValue>) => Observable<null | ValidatorError>;

export interface FormControlOptions {
    value?: string;
    validators?: Array<formValidator>;
	asyncValidators?: Array<asyncFormValidator>;
}

export interface FormControlConfig extends FormControlOptions {
    name: string;
}

export enum FormStatusType {
    valid = 'VALID',
    invalid = 'INVALID',
}

export interface FormStatus {
    status: FormStatusType;
    errors?: ValidatorError[];
}

export class FormControl {
    public readonly name: string;

    private readonly $value: Subject<formValue>;
    private readonly validators: Array<formValidator>;
	private readonly asyncValidators: Array<asyncFormValidator>;
    private readonly touched: Subject<boolean> = new Subject<boolean>(false);
    private readonly hasFocus: Subject<boolean> = new Subject<boolean>(false);
	private readonly disabled: Subject<boolean> = new Subject<boolean>(false);
	private readonly animations: Subject<AppAnimation> = new Subject<AppAnimation>();

    private _value: formValue;

    constructor(config: FormControlConfig) {
    	this.$value = new Subject<formValue>(config.value || '');
    	this._value = config.value;
    	this.name = config.name;
    	this.validators = config.validators || [];
    	this.asyncValidators = config.asyncValidators || [];
    }

    public get value(): formValue {
    	return this._value;
    }

    public get $valueChanged(): Observable<formValue> {
    	return this.$value.asObserveble();
    }

    public get $statusChanged(): Observable<FormStatus> {
    	return Observable.all([
    		this.$valueChanged,
    		...this.asyncValidators.map(validate => validate(this.$valueChanged)),
    	])
    		.map(([value, ...asyncValidatorsResults]) =>
    			this.mapValueToStatus(
    				value,
					asyncValidatorsResults as Array<null | ValidatorError>,
    			),
    		)
    		.uniqueNext(true, (last, next) => FormControl.hasDiffInStatuses(last, next));
    }

    public get $touched(): Observable<boolean> {
    	return this.touched.asObserveble();
    }

    public get $changeFocus(): Observable<boolean> {
    	return this.hasFocus.asObserveble()
    		.uniqueNext();
    }

    public get $isValid(): Observable<boolean> {
    	return this.$statusChanged.map(status => status.status === FormStatusType.valid)
    		.uniqueNext();
    }

    public get $disabled(): Observable<boolean> {
    	return this.disabled.asObserveble()
    		.uniqueNext();
    }

    public get $animations(): Observable<AppAnimation> {
    	return this.animations.asObserveble();
    }

    public next(value: formValue): void {
    	this._value = value;
    	this.$value.next(value || '');
    }

    public touch(): void {
    	this.touched.next(true);
    }

    public disable(disabled: boolean): void {
    	this.disabled.next(disabled);
    }

    public changeFocus(hasFocus: boolean): void {
    	this.hasFocus.next(hasFocus);
    }

    public animate(animations: AppAnimation): void {
    	this.animations.next(animations);
    }

    private static hasDiffInStatuses(last: FormStatus, next: FormStatus): boolean {
    	const hasStatusDiff = last.status !== next.status;

    	return hasStatusDiff || FormControl.hasErrorsDiff(last.errors, next.errors);
    }

    private static hasErrorsDiff(
    	last: ValidatorError[] | undefined, next: ValidatorError[] | undefined): boolean {
    	if ((last && !next) || (!last && next)) {
    		return true;
    	}

    	if (last === undefined && next === undefined) {
    		return false;
    	}

    	if (last!.length !== next!.length) {
    		return true;
    	}

    	for (let index = 0; index < last!.length; index++) {
    		if (!last![index].equals(next![index])) {
    			return true;
    		}
    	}

    	return false;
    }

    private mapValueToStatus(
    	value: formValue,
    	asyncValidatorsResults: Array<ValidatorError | null>,
    ): FormStatus {
    	let errors = [];

    	for (const validator of this.validators) {
    		const error = validator(value);

    		if (error) {
    			errors.push(error);
    		}
    	}

    	errors = errors.concat(
			asyncValidatorsResults.filter(error => Boolean(error)) as ValidatorError[],
    	);

    	if (errors.length === 0) {
    		return {status: FormStatusType.valid};
    	}

    	return {
    		status: FormStatusType.invalid,
    		errors,
    	};
    }
}
