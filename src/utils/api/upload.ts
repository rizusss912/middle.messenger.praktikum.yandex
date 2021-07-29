import {HTTPRequest} from "./http-request";

function queryStringify(query: {[key: string]: string} | undefined): string {
	if (!query || typeof query !== 'object' || Object.keys(query).length === 0) {
		return '';
	}

	return `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
}

export function upload(request: HTTPRequest): Promise<XMLHttpRequest> {
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
            resolve(xhr);
        };

        xhr.open(
            request.method,
            `${request.origin}/${request.pathname.join('/')}${queryStringify(request.queryParams)}`,
        );

        const body = typeof request.body === 'object'
            ? JSON.stringify(request.body)
            : request.body;

        xhr.send(body);
    });
}