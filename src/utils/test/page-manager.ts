
import {Page} from 'puppeteer';
import {pages} from '../../service/router/pages.config';

const testUrl = 'http://localhost:3000';

export class PageManager {
    private readonly page: Page;

    constructor(page: Page) {
    	this.page = page;
    }

    open(pageUrl: pages | string = pages.main): Promise<void> {
    	return this.page.goto(`${testUrl}${pageUrl}`).then();
    }

    clearBody(): Promise<void> {
    	return this.page.evaluate(() => {
    		document.body.innerHTML = '';
    	});
    }

    appendChildToBody(tag: string): Promise<void> {
    	return this.page.evaluate(tag => {
    		document.body.appendChild(document.createElement(tag));
    	}, tag);
    }

    setAttribute(selector: string, attributeName: string, attributeValue: string = ''): Promise<void> {
    	return this.page.evaluate(
    		(selector, attributeName, attributeValue) => {
    			document.body.querySelector(selector)?.setAttribute(attributeName, attributeValue);
    		},
    		selector,
    		attributeName,
    		attributeValue,
    	);
    }

    removeAttribute(selector: string, attributeName: string): Promise<void> {
    	return this.page.evaluate(
    		(selector, attributeName) => {
    			document.body.querySelector(selector)?.removeAttribute(attributeName);
    		},
    		selector,
    		attributeName,
    	);
    }

    hasElement(selector: string): Promise<boolean> {
    	return this.page.evaluate(
    		selector => Boolean(document.body.querySelector(selector)),
    		selector,
    	);
    }

    hasAttribute(selector: string, attributeName: string): Promise<boolean> {
    	return this.page.evaluate(
    		(selector, attributeName) =>
    			Boolean(document.body.querySelector(selector)?.hasAttribute(attributeName)),
    		selector,
    		attributeName,
    	);
    }

    getAttribute(selector: string, attributeName: string): Promise<string | null> {
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

	public async wait(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
