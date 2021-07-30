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

//@ts-ignore тут вообще никак не получается без any (
export type Component = CustomHTMLElement & any;
export type Clazz = Partial<{observedAttributes: string}> & (new () => Component);

export function component(config: ComponentConfig):
(Сlazz: Clazz) => Clazz {
	return function (Clazz: Clazz): Clazz {
		class CustomElement extends HTMLElement {
            private templator: Templator<Component> | undefined;
            private readonly clazz: Component;

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
            	return (Object.values(defaultObservedAttributes) as string[])
					.concat(
            			config.observedAttributes ? config.observedAttributes : [],
            		).concat(
						Clazz.observedAttributes ? Clazz.observedAttributes : [],
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
            	this.templator = new Templator(this.clazz, config.template);

            	for (const node of this.templator.nodes) {
            		this.appendChild(node);
            	}
            }

            inject(fieldName: string, value: unknown): void {
            	// @ts-ignore
            	this.clazz[fieldName] = value;
            }

            onDefaultAttributeChanged(
            	name: string, _oldValue: string | null, newValue: string | null): boolean {
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

		return <new () => Component>CustomElement;
	};
}
