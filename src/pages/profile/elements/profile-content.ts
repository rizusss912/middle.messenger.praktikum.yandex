import {CustomHTMLElement} from '../../../utils/component';

export class ProfileContent implements CustomHTMLElement {
    private element: HTMLElement;
    private isInitHiddenStatus: boolean = true;

    public onRendered(element: HTMLElement): void {
        this.element = element;
    }

    protected static get observedAttributes(): string[] {
        return ['hidden-with-animtion'];
    }

    public onAttributeChanged(name: string, _oldValue: string | null, newValue: string | null): boolean {
        switch (name) {
            case 'hidden-with-animtion':
                if (_oldValue === newValue) return false;
                if (this.isInitHiddenStatus) {
                    this.isInitHiddenStatus = false;
                    newValue === 'false'
                        ? this.element.removeAttribute('hidden')
                        : this.element.setAttribute('hidden', '')

                    return false;
                }

                newValue === 'false' ? this.show() : this.hide();

                return false;
            default: return false;
        }
    }

    onDestroy() {
        console.log('onDestroy');
    }

    private hide(): void {
        this.element.animate([{ opacity: 0, transform: 'scale(0.9)'}], {duration: 100})
            .finished.then(() => this.element.setAttribute('hidden', ''));
    }

    private show(): void {
        this.element.removeAttribute('hidden');
        this.element.animate([{ opacity: 0, transform: 'scale(1.1)'}, { opacity: 1}], {duration: 100})
            .finished.then(() => this.element.removeAttribute('hidden'));
    }
}