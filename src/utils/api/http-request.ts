import {HTTPMethod} from './http-method';

export interface HTTPRequest {
    origin: string;
    method: HTTPMethod;
    pathname: string[];
    queryParams?: {[key: string]: string};
    headers?: {[key: string]: string};
    timeout?: number;
    body?: object | string;
}
