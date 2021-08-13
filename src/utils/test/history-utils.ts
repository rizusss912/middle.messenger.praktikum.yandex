import { Page } from "puppeteer";


export class HistoryUtils {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public pushState(path: string): Promise<void> {
        return this.page.evaluate(
            path => window.history.pushState({}, 'page', `${window.location.origin}${path}`),
            path,
        );
    }

    public forward(): Promise<void> {
        return this.page.evaluate(
            () => window.history.forward(),
        );
    }

    public back(): Promise<void> {
        return this.page.evaluate(
            () => window.history.back(),
        );
    }
}