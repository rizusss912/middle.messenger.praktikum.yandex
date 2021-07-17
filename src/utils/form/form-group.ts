import { Observable } from "../observeble/observeble";
import {FormControl, FormControlOptions} from "./form-control";

export interface FormGroupConfig<Form extends {[key: string]: string | undefined}> {
    controls?: Record<keyof Form, FormControlOptions>;
}

export class FormGroup<Form extends {[key: string]: string | undefined}> {
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

    get value(): Record<keyof Form, string | undefined> {
        return Object.values(this.controls).reduce((out, control) => {
            (out[control.name] as keyof Form) = control.value;

            return out;
        }, {} as Record<keyof Form, string | undefined>);
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
}