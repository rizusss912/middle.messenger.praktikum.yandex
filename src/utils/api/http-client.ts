import {HTTPRequest} from './http-request';

type query = {[key: string]: string} | undefined;

export type AppHTTPRequest = Omit<HTTPRequest, 'origin'>;

export class HTTPClient {
    private readonly origin: string | undefined;

    constructor(origin?: string) {
    	this.origin = origin;
    }

    public upload(appRequest: AppHTTPRequest): Promise<XMLHttpRequest> {
    	const request: HTTPRequest = Object.create(appRequest);

    	request.origin = this.origin || window.location.origin;

    	return HTTPClient.upload(request);
    }
    
    private static queryStringify(query: query): string {
        if (!query || typeof query !== 'object' || Object.keys(query).length === 0) {
            return '';
        }
    
        return `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
    }
    
    private static upload(request: HTTPRequest): Promise<XMLHttpRequest> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
    
            if (request.headers) {
                for (const [key, value] of Object.entries(request.headers)) {
                    xhr.setRequestHeader(key, value);
                }
            }
    
            if (request.timeout) {
                xhr.timeout = request.timeout;
            }
    
            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr);
                } else {
                    reject(xhr);
                }
            };
    
            xhr.open(
                request.method,
                `${request.origin}/${request.pathname.join('/')}${HTTPClient.queryStringify(request.queryParams)}`,
            );
    
            const body = typeof request.body === 'object'
                ? JSON.stringify(request.body)
                : request.body;
    
            xhr.send(body);
        });
    }    
}
