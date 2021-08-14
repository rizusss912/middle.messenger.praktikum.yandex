import {Page} from 'puppeteer';

export class DomUtils {
    private readonly page: Page;

    constructor(page: Page) {
    	this.page = page;
    }

    public clearBody(): Promise<void> {
    	return this.page.evaluate(() => {
    		document.body.innerHTML = '';
    	});
    }

    public appendChildToBody(tag: string): Promise<void> {
    	return this.page.evaluate(tag => {
    		document.body.appendChild(document.createElement(tag));
    	}, tag);
    }

    public setAttribute(selector: string, attributeName: string, attributeValue: string = ''): Promise<void> {
    	return this.page.evaluate(
    		(selector, attributeName, attributeValue) => {
    			document.body.querySelector(selector)?.setAttribute(attributeName, attributeValue);
    		},
    		selector,
    		attributeName,
    		attributeValue,
    	);
    }

    public removeAttribute(selector: string, attributeName: string): Promise<void> {
    	return this.page.evaluate(
    		(selector, attributeName) => {
    			document.body.querySelector(selector)?.removeAttribute(attributeName);
    		},
    		selector,
    		attributeName,
    	);
    }

    public hasElement(selector: string): Promise<boolean> {
    	return this.page.evaluate(
    		selector => Boolean(document.body.querySelector(selector)),
    		selector,
    	);
    }

    public hasAttribute(selector: string, attributeName: string): Promise<boolean> {
    	return this.page.evaluate(
    		(selector, attributeName) =>
    			Boolean(document.body.querySelector(selector)?.hasAttribute(attributeName)),
    		selector,
    		attributeName,
    	);
    }

    public getAttribute(selector: string, attributeName: string): Promise<string | null> {
    	return this.page.evaluate(
    		(selector, attributeName) =>
    			document.body.querySelector(selector)?.getAttribute(attributeName),
    		selector,
    		attributeName,
    	);
    }

    public async clickOnElement(selector: string) {
    	const rect = await this.page.evaluate(el => {
    		const {top, left, width, height} = el.getBoundingClientRect();
    		return {top, left, width, height};
    	}, await this.page.$(selector));

    	// Use given position or default to center
    	const _x = rect.width / 2;
    	const _y = rect.height / 2;

    	await this.page.mouse.click(rect.left + _x, rect.top + _y);
    }
}
