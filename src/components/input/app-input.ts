import {Component, CustomHTMLElement} from '../../utils/component';

import {template} from './app-input.tmpl';

import './app-input.less';
import { FormControl } from '../../utils/form/form-control';


@Component<AppInput>({
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

            if(this.formControl) {
                this.formControl.$valueChanged.subscribe(value => this.input.value = value);
            } else {
                this.formControl = new FormControl({name: ''});
            }
        }

        public onFocus(event: Event): void {
        }

        public onBlur(event: Event): void {
        }

        public onInput(event: InputEvent): void {
            this.formControl.next((event.target as HTMLInputElement).value);
        }
    }

