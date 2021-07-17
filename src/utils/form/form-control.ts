import { Observable } from "../observeble/observeble";
import { Subject } from "../observeble/subject";

export interface FormControlOptions {
    value?: string;
}

export interface FormControlConfig extends FormControlOptions {
    name: string;
}

export class FormControl {
    public readonly name: string;

    private _value: string | undefined;

    private readonly $value: Subject<string>;

    constructor(config: FormControlConfig) {
        this.name = config.name;
        this.$value = new Subject<string>(config.value  || '');
        this._value = config.value;
    }

    public get value(): string | undefined {
        return this._value;
    }

    public get $valueChanged(): Observable<string> {
        return this.$value.asObserveble();
    }

    public next(value: string): void {
        this._value = value;
        this.$value.next(value);
    }
}