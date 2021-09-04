import {Interceptor} from '../interfaces/interceptor';
import {AppHTTPRequest, HTTPClient, HTTPResponse} from './http-client';

export class HTTPClientModule {
    private readonly httpClient: HTTPClient;
    private readonly mutualPathname: string[];

    constructor(origin: string, mutualPathname: string[] = [], interceptors: Interceptor[] = []) {
    	this.httpClient = new HTTPClient(origin, interceptors);
    	this.mutualPathname = mutualPathname;
    }

    protected upload<body>(request: AppHTTPRequest): Promise<HTTPResponse<body>> {
    	const moduleRequest = {...request};

    	moduleRequest.pathname = this.mutualPathname.concat(moduleRequest.pathname);

    	return this.httpClient.upload<body>(moduleRequest);
    }
}
