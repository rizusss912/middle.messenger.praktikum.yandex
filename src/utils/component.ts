import {Guard} from './interfaces/guard';
import {Observable} from './observeble/observeble';
import {Templator, RenderOptions} from './templator/templator';

export interface ComponentConfig {
    name: string;
    template: string;
    observedAttributes?: string[];
	guards?: Array<new () => Guard>;
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

// @ts-ignore тут вообще никак не получается без any (
export type Component = CustomHTMLElement & any;
export type Clazz = Partial<{observedAttributes: string}> & (new () => Component);

export function component(config: ComponentConfig):
(Сlazz: Clazz) => Clazz {
	return function (Clazz: Clazz): Clazz {
		class CustomElement extends HTMLElement {
            private templator: Templator<Component> | undefined;
            private clazz: Component;
			private template: string;

			constructor() {
            	super();

				this.template = config.template;
            	this.clazz = new Clazz();
			}

			public connectedCallback(): void {
				if (config.guards) {
					this.checkGuards(config.guards);
				}

            	if (this.clazz.onInit) {
            		this.clazz.onInit();
            	}

            	this.render();

            	if (this.clazz.onRendered) {
            		this.clazz.onRendered(this);
            	}
			}

			public disconnectedCallback(): void {
            	if (this.clazz.onDestroy) {
            		this.clazz.onDestroy();
            	}
			}

			public static get observedAttributes(): string[] {
            	// @ts-ignore
            	return (Object.values(defaultObservedAttributes) as string[])
            		.concat(
            			config.observedAttributes ? config.observedAttributes : [],
            		).concat(
            			Clazz.observedAttributes ? Clazz.observedAttributes : [],
            		);
			}

			public attributeChangedCallback(
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

			// @ts-ignore используется внешними компонентами
			public inject(fieldName: string, value: unknown): void {
				// @ts-ignore
				this.clazz[fieldName] = value;
			}

			private render(): void {
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

			private init(): void {
            	this.templator = new Templator(this.clazz, this.template);

            	for (const node of this.templator.nodes) {
            		this.appendChild(node);
            	}
			}

			private onDefaultAttributeChanged(
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

			private async checkGuards(guards: Array<new () => Guard>): Promise<void> {
				for (const GuardConstructor of guards) {
					const guard = new GuardConstructor();
					const canOpen = guard.canOpen();

					if (canOpen instanceof Promise) {
						if (!await canOpen) {
							guard.onOpenError();
							this.fillsWithEmptiness();

							return;
						}
					} else if (!canOpen) {
						guard.onOpenError();
						this.fillsWithEmptiness();

						return;
					}
				}
			}

			private fillsWithEmptiness(): void {
				this.template = '';
				this.clazz = {};
			}
		}

		customElements.define(config.name, CustomElement);

		return <new () => Component>CustomElement;
	};
}
