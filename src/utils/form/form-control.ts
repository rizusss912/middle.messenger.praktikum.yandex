import { Observable } from "../observeble/observeble";
import { Subject } from "../observeble/subject";
import { ValidatorError } from "./validator-error";

export type formValue = string | undefined;

export interface FormControlOptions {
    value?: string;
    validators?: Array<(value: formValue) => null | ValidatorError>;
}

export interface FormControlConfig extends FormControlOptions {
    name: string;
}

export enum FormStatusType {
    valid = "VALID",
    invalid = "INVALID",
}

export interface FormStatus {
    status: FormStatusType;
    errors?: ValidatorError[];
}

export class FormControl {
    public readonly name: string;

    private _value: formValue;

    private readonly $value: Subject<string>;

    private readonly validators: Array<(value: formValue) => null | ValidatorError>;

    constructor(config: FormControlConfig) {
        this.$value = new Subject<string>(config.value  || '');
        this._value = config.value;
        this.name = config.name;
        this.validators = config.validators || [];
    }

    public get value(): formValue {
        return this._value;
    }

    public get $valueChanged(): Observable<string> {
        return this.$value.asObserveble();
    }

    public get $statusChanged(): Observable<FormStatus> {
        return this.$valueChanged
            .map(value => this.mapValueToStatus(value))
            .uniqueNext(true,(last, next) => FormControl.hasDiffInStatuses(last, next));
    }

    public next(value: string): void {
        this._value = value;
        this.$value.next(value);
    }

    private static hasDiffInStatuses(last: FormStatus, next: FormStatus): boolean {
        const hasStatusDiff = last.status !== next.status;

        return hasStatusDiff || FormControl.hasErrorsDiff(last.errors, next.errors);
    }

    private static hasErrorsDiff(last: ValidatorError[] | undefined, next: ValidatorError[] | undefined): boolean {
        if (last === undefined && next !== undefined || last !== undefined && next === undefined) return true;
        if (last === undefined && next === undefined) return false;
        if (last.length !== next.length) return true;
        
        for (var index = 0; index < last.length; index++) {
            if (!last[index].equals(next[index])) return true;
        }

        return false;
    }

    private mapValueToStatus(value: formValue): FormStatus {
        const errors = [];

        for (const validator of this.validators) {
            const error = validator(value);

            if (error) {
                errors.push(error);
            }
        }

        if (errors.length === 0) return {status: FormStatusType.valid};

        return {
            status: FormStatusType.invalid,
            errors,
        };
    }
}