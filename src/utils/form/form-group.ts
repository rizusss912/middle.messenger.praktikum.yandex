import { Observable } from "../observeble/observeble";
import {FormControl, FormControlOptions, FormStatusType, formValue} from "./form-control";
import { ValidatorError } from "./validator-error";

export interface FormGroupConfig<Form extends {[key: string]: formValue}> {
    controls?: Record<keyof Form, FormControlOptions>;
}

export class FormGroup<Form extends {[key: string]: formValue}> {
    public readonly controls: Record<keyof Form, FormControl>;

    constructor(config: FormGroupConfig<Form>) {
        var controls = {} as Record<keyof Form, FormControl>;

        if (config.controls) {
            for (var name in config.controls) {
                controls[name] = new FormControl({name, ...config.controls[name]});
            }
        }

        this.controls = controls;
    }

    get value(): Record<keyof Form, formValue> {
        return Object.values(this.controls).reduce((out, control) => {
            (out[control.name] as keyof Form) = control.value;

            return out;
        }, {} as Record<keyof Form, formValue>);
    }

    public get $valueChanged(): Observable<Form> {
        return Observable.concat(
            Object.values(this.controls).map(control => 
                control.$valueChanged
                    .map(value => { return {value, name: control.name}})
                ),
            ).map(entrys => entrys.reduce((out, entry) => {

                (out[entry.name] as keyof Form) = entry.value;

                return out;
            }, {} as Form));
    }

    public get $statusChanged(): Observable<{
        status: FormStatusType;
        errors?: {[key in keyof Form]: ValidatorError[]};
    }> {
        return Observable.concat(
            Object.values(this.controls).map(control => 
                control.$statusChanged
                    .map(status => { return {...status, name: control.name}})
                ),
            ).map(statuses => {
                const isValid = statuses.every(status => status.status === FormStatusType.valid);

                if (isValid) return {status: FormStatusType.valid};

                const errors = statuses.reduce((out, status) => {
                    if (status.errors) {
                        out[status.name as keyof Form] = status.errors;
                    }

                    return out;
                }, {} as {[key in keyof Form]: ValidatorError[]});

                return {status: FormStatusType.invalid, errors};
            });
    }

    public touch(): void {
        for (var control of Object.values(this.controls)) {
            control.touch();
        }
    }
}