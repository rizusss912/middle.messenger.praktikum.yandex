import { Page } from "puppeteer";
import * as sinon from "sinon";

//@ts-ignore
globalThis.window = globalThis;
//@ts-ignore
window.location = {};

export class ApiUtils {
    private readonly page: Page;
    private readonly _onRequestStub = sinon.stub();
    private _needContinueRequest: boolean = true;

    constructor(page: Page) {
        this.page = page;

         this.mockRequest();
    }

    public static mocKXMLHttpRequest(): sinon.SinonStubbedInstance<XMLHttpRequest> {
        if (!globalThis.XMLHttpRequest) {
            //@ts-ignore
            globalThis.XMLHttpRequest = class XMLHttpRequest {};
        }

        return sinon.createStubInstance<XMLHttpRequest>(XMLHttpRequest);
    }

    public set needContinueRequest(need: boolean) {
        this._needContinueRequest = need;
    }

    public get onRequestStub(): sinon.SinonStub {
        return this._onRequestStub;
    }

    public restore(): void {
        this._onRequestStub.restore();
    }

    private mockRequest(): void {
        this.page.setRequestInterception(true);

        page.on('request', async request => {
            this._onRequestStub();

            await this._needContinueRequest
                ? request.continue()
                : request.abort();
           });
    }
}