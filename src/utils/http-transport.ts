enum METHODS {
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE',
}

interface fetchOptions {
    data?: {[key: string]: string};
    timeout?: number;
    method?: METHODS;
    headers?: {[key: string]: string};
    retries?: number;
}

/**
* Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
* На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
* На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
*/
function queryStringify(data: {[key: string]: string} | undefined): string {
	if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
		return '';
	}

	return `?${Object.keys(data).map(key => `${key}=${data[key]}`).join('&')}`;
}

export class HTTPTransport {
	public get(url: string, options: fetchOptions = {}) {
		return this.request(url, {...options, method: METHODS.GET});
	}

	public put(url: string, options: fetchOptions = {}) {
    	return this.request(url, {...options, method: METHODS.PUT});
	}

	public post(url: string, options: fetchOptions = {}) {
    	return this.request(url, {...options, method: METHODS.POST});
	}

	public delete(url: string, options: fetchOptions = {}) {
    	return this.request(url, {...options, method: METHODS.DELETE});
	}

	// PUT, POST, DELETE

	// options:
	// headers — obj
	// data — obj

	private request(url: string, options: fetchOptions) {
		let {method, data} = options;

		if (!method) {
			method = METHODS.GET;
		}

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			if (options.headers) {
				for (const [key, value] of Object.entries(options.headers)) {
					xhr.setRequestHeader(key, value);
				}
			}

			xhr.open(method as string, url + queryStringify(data));

			xhr.onload = function () {
				resolve(xhr);
			};

			xhr.onabort = reject;
			xhr.onerror = reject;
			xhr.ontimeout = reject;

			xhr.send();
		});
	}
}
