import {HTMLElementRenderer} from './html-element-renderer';

export class HTMLElementsRenderManager<Context extends object> {
    private readonly context: Context;
    private readonly renderers: HTMLElementRenderer<Context>[] = [];

    constructor(context: Context) {
    	this.context = context;
    }

    public initNode(tagStr: string): HTMLElement {
    	const elementRenderer = new HTMLElementRenderer<Context>(tagStr, this.context);

    	this.renderers.push(elementRenderer);

    	return elementRenderer.element;
    }

    public renderAll(): void {
    	for (const elementRenderer of this.renderers) {
    		elementRenderer.render();
    	}
    }
}
