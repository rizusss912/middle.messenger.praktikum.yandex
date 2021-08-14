import {Page} from 'puppeteer';
import {pages} from '../../service/router/pages.config';
import {testConfig} from './test-config';

export class PageUtils {
    private readonly page: Page;

    constructor(page: Page) {
    	this.page = page;
    }

    open(pageUrl: pages | string = pages.main): Promise<void> {
    	return this.page.goto(`${testConfig.url}${pageUrl}`).then();
    }
}
