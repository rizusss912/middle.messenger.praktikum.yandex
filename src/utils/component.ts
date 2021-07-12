//import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
//import '@webcomponents/custom-elements';

import { Observable } from './observeble/observeble';
import {Templator, RenderOptions} from './templator';

export interface ComponentConfig {
    name: string;
    template: string;
    observedAttributes?: string[];
}

export interface CustomHTMLElement {
    content?: HTMLElement[] | Observable<HTMLElement[]>;
    onInit?: () => void;
    onDestroy?: () => void;
    onAttributeChanged?: (name: string, oldValue: string, newValue: string) => boolean;
};

enum defaultObservedAttributes {
    hidden = 'hidden',
    style = 'style',
}

export function Component<T extends CustomHTMLElement>(config: ComponentConfig): (clazz: new () => T) => new () => T {
    return function(clazz: new () => T): new () => T {
        class CustomElement extends HTMLElement {
            private templator: Templator | undefined;
            private readonly clazz: T;

            constructor() {
                super();

                this.clazz = new clazz();
            }

            connectedCallback(): void {
                if (this.clazz.onInit) this.clazz.onInit();
                this.render();
            }

            disconnectedCallback(): void {
                if (this.clazz.onDestroy) this.clazz.onDestroy();
            }

            static get observedAttributes(): string[] {
                //@ts-ignore
                return Object.values(defaultObservedAttributes).concat(config.observedAttributes ? config.observedAttributes : []);
            }

            attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
                var needRender = false;

                //@ts-ignore name - строка не обязательно содержааяся в defaultObservedAttributes
                if (Object.values(defaultObservedAttributes).includes(name)) {
                    needRender = this.onDefaultAttributeChanged(name, oldValue, newValue);
                }
                if (this.clazz.onAttributeChanged) {
                    needRender = this.clazz.onAttributeChanged(name, oldValue, newValue) || needRender;
                }
                if (needRender) this.render();
            }

            render(): void {
                const options: RenderOptions = {};
                const content = this.clazz.content;

                if (content) options.content = content;
                if (!this.templator) this.init();

                this.templator.render(this.clazz, options);
            }

            init(): void {
                this.templator = new Templator(config.template);
    
                for (var node of this.templator.nodes) {
                    this.appendChild(node);
                }
            }

            onDefaultAttributeChanged(name: string, oldValue: string | null, newValue: string | null): boolean {
                switch (name) {
                    case defaultObservedAttributes.hidden: 
                        this.style.display = this.hasAttribute(defaultObservedAttributes.hidden) ? 'none' : null;
                    break;
                    case defaultObservedAttributes.style:
                        if (!newValue) this.removeAttribute(defaultObservedAttributes.style);
                    break;
                }

                return false;
            }
        }

        customElements.define(config.name, CustomElement, config.options);

        return <new () => T><unknown>CustomElement;
    }
}