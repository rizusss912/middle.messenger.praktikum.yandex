import {Component, CustomHTMLElement} from '../../utils/component';

import {template} from './app-button.tmpl';

import './app-button.less';
import { Subject } from '../../utils/observeble/subject';
import { Observable } from '../../utils/observeble/observeble';

@Component<AppButton>({
    name: 'app-button',
    template,
    observedAttributes: ['disabled'],
})
export class AppButton implements CustomHTMLElement {
    private disabled: Subject<boolean> = new Subject<boolean>(false);
    private _disabled: boolean = false;

    get $disabled(): Observable<boolean> {
        return this.disabled.asObserveble();
    }

    public onRendered(element: HTMLElement): void {
        element.querySelector('button').addEventListener('click', event => {
                if (this._disabled) {
                    event.stopPropagation();

                    element.dispatchEvent(new CustomEvent('disabledclick'));
                }
            });
    }

    public onAttributeChanged(name: string, oldValue: string | null, newValue: string | null): boolean {
        switch (name) {
            case 'disabled':
                this._disabled = newValue !== null;
                this.disabled.next(newValue !== null);

                return true;
        }

        return false;
    }
}
