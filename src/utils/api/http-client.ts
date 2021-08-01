import {HTTPRequest} from './http-request';

type query = {[key: string]: string} | undefined;
type requestHandler = (this: XMLHttpRequest, ev: ProgressEvent) => any;

export interface HTTPResponse<Body> {
    status: number,
    statusText: string,
    body: Body,
}

export type AppHTTPRequest = Omit<HTTPRequest, 'origin'>;

export class HTTPClient {
    private readonly origin: string | undefined;

    constructor(origin?: string) {
    	this.origin = origin;
    }

    public upload<body>(appRequest: AppHTTPRequest): Promise<HTTPResponse<body>> {
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
    
    private static upload<body>(request: HTTPRequest): Promise<HTTPResponse<body>> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            if (request.timeout) {
                xhr.timeout = request.timeout;
            }

            xhr.responseType =	"json";
            xhr.withCredentials = true;

            xhr.onabort = this.getXMLHttpRequestHandler<body>(resolve, reject);
            xhr.onerror = this.getXMLHttpRequestHandler<body>(resolve, reject);
            xhr.ontimeout = this.getXMLHttpRequestHandler<body>(resolve, reject);
            xhr.onload = this.getXMLHttpRequestHandler<body>(resolve, reject);

            xhr.open(
                request.method,
                `${request.origin}/${request.pathname.join('/')}${HTTPClient.queryStringify(request.queryParams)}`,
            );

            if (request.headers) {
                for (const [key, value] of Object.entries(request.headers)) {
                    xhr.setRequestHeader(key, value);
                }
            }

            xhr.setRequestHeader('Content-Type', 'application/json');

            const body = typeof request.body === 'object'
                ? JSON.stringify(request.body)
                : request.body;
    
            xhr.send(body);
        });
    }

    private static getXMLHttpRequestHandler<body>(resolve: Function, reject: Function): requestHandler {
        return function(this: XMLHttpRequest, _event: ProgressEvent) {
            if (this.status >= 200 && this.status < 300) {
                resolve(HTTPClient.mapXMLHttpRequestToResponse<body>(this));
            } else {
                reject(HTTPClient.mapXMLHttpRequestToResponse<body>(this));
            }
        };
    }

    private static mapXMLHttpRequestToResponse<body>(xhr: XMLHttpRequest): HTTPResponse<body> {
        return {
                status: xhr.status,
                statusText: xhr.statusText,
                body: xhr.response,
            };
    }
}
