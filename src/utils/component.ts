import {Observable} from './observeble/observeble';
import {Templator, RenderOptions} from './templator/templator';

export interface ComponentConfig {
    name: string;
    template: string;
    observedAttributes?: string[];
}

export interface CustomHTMLElement {
    content?: HTMLElement[] | Observable<HTMLElement[]>;
    onInit?: () => void;
    onRendered?: (element: HTMLElement) => void;
    onDestroy?: () => void;
    onAttributeChanged?: (
		name: string, oldValue: string | null, newValue: string | null) => boolean;
}

enum defaultObservedAttributes {
    hidden = 'hidden',
    style = 'style',
}

export function Component<T extends CustomHTMLElement>(config: ComponentConfig):
(Сlazz: new () => T) => new () => T {
	return function (Clazz: new () => T): new () => T {
		class CustomElement extends HTMLElement {
            private templator: Templator<T> | undefined;
            private readonly clazz: T;

            constructor() {
            	super();

            	this.clazz = new Clazz();
            }

            connectedCallback(): void {
            	if (this.clazz.onInit) {
            		this.clazz.onInit();
            	}

            	this.render();
            	if (this.clazz.onRendered) {
            		this.clazz.onRendered(this);
            	}
            }

            disconnectedCallback(): void {
            	if (this.clazz.onDestroy) {
            		this.clazz.onDestroy();
            	}
            }

            static get observedAttributes(): string[] {
            	// @ts-ignore
            	return (Object.values(
            		defaultObservedAttributes) as string[]).concat(
            		config.observedAttributes ? config.observedAttributes : [],
            	);
            }

            attributeChangedCallback(
            	name: string, oldValue: string | null, newValue: string | null): void {
            	let needRender = false;

            	// @ts-ignore name - строка не обязательно содержааяся в defaultObservedAttributes
            	if (Object.values(defaultObservedAttributes).includes(name)) {
            		needRender = this.onDefaultAttributeChanged(name, oldValue, newValue);
            	}

            	if (this.clazz.onAttributeChanged) {
            		needRender = this.clazz.onAttributeChanged(name, oldValue, newValue)
						|| needRender;
            	}

            	if (needRender) {
            		this.render();
            	}
            }

            render(): void {
            	const options: RenderOptions = {};
            	const {content} = this.clazz;

            	if (content) {
            		options.content = content;
            	}

            	if (!this.templator) {
            		this.init();
            	}

            	this.templator!.render(this.clazz);
            }

            init(): void {
            	this.templator = new Templator(config.template, this.clazz);

            	for (const node of this.templator.nodes) {
            		this.appendChild(node);
            	}
            }

            inject(fieldName: string, value: unknown): void {
            	// @ts-ignore
            	this.clazz[fieldName] = value;
            }

            onDefaultAttributeChanged(
            	name: string, oldValue: string | null, newValue: string | null): boolean {
            	switch (name) {
            		case defaultObservedAttributes.hidden:
            			this.style.display = this.hasAttribute(defaultObservedAttributes.hidden)
            				? 'none'
            				: '';
            			break;
            		case defaultObservedAttributes.style:
            			if (!newValue) {
            				this.removeAttribute(defaultObservedAttributes.style);
            			}

            			break;
            		default: return false;
            	}

            	return false;
            }
		}

		customElements.define(config.name, CustomElement);

		return <new () => T><unknown>CustomElement;
	};
}
