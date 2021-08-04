//for async/await
import 'regenerator-runtime/runtime';

import {component, CustomHTMLElement} from './utils/component';
import {template} from './app-root.tmpl';
import {RouterService} from './service/router/router.service';
import {Observable} from './utils/observeble/observeble';

import {HTMLPageConstructor} from './service/router/router.config';

import './app-root.less';

@component({
	name: 'app-root',
	template,

})
export class AppRoot implements CustomHTMLElement {
    private readonly router: RouterService<{}>;
	private element: Element;

    constructor() {
    	this.router = new RouterService();
    }

    public onInit(): void {}

	public onRendered(element: HTMLElement): void {
		this.element = element;

		window.inert = (v) => this.inertContent(v);
		window.dialog = (isOpen) => this.dialog(isOpen);
	}

    public get content(): Observable<HTMLElement[]> {
    	return this.router.$path
    		.map(pathname => this.router.getPageByPath(pathname))
    		// TODO: Проблема с типизацией. HTMLPage !== HTMLElement (
    		.map(
    			(constructor: HTMLPageConstructor) => [new constructor() as unknown as HTMLElement],
    		);
    }

	public inertContent(inert: true): void {
		if(!this.element) return;

		if(inert) {
			this.element.setAttribute('aria-hiden', 'true');
			this.element.style['pointer-events'] = 'none';
			this.element.addEventListener('focus', this.keydownEventListen, true);
		} else {
			this.element.removeAttribute('aria-hiden');
			this.element.style['pointer-events'] = null;
			this.element.removeEventListener('focus', this.keydownEventListen);
		}
	}

	private keydownEventListen(e: Event): void {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		e.target.setAttribute('tabindex', '-1');
		console.log(e);
	}

	private dialog(isOpen): void {
		if(!this.element) return;

		const dialog = this.element.querySelector('dialog');

		if (!dialog) return;

		if(isOpen) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}
}
