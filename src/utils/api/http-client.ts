import {HTTPRequest} from './http-request';
import {upload} from './upload';

export type AppHTTPRequest = Omit<HTTPRequest, 'origin'>;

export class HTTPClient {
    private readonly origin: string | undefined;

    constructor(origin?: string) {
    	this.origin = origin;
    }

    public upload(appRequest: AppHTTPRequest): Promise<XMLHttpRequest> {
    	const request: HTTPRequest = Object.create(appRequest);

    	request.origin = this.origin || window.location.origin;

    	return upload(request);
    }
}
