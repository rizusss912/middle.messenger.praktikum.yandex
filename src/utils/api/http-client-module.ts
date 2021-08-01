import {AppHTTPRequest, HTTPClient} from './http-client';

export class HTTPClientModule {
    private readonly httpClient: HTTPClient;
    private readonly mutualPathname: string[];

    constructor(origin: string, mutualPathname: string[] = []) {
    	this.httpClient = new HTTPClient(origin);
    	this.mutualPathname = mutualPathname;
    }

    protected upload(request: AppHTTPRequest): Promise<XMLHttpRequest> {
    	const moduleRequest = {...request};

    	moduleRequest.pathname = this.mutualPathname.concat(moduleRequest.pathname);

    	return this.httpClient.upload(moduleRequest);
    }
}
