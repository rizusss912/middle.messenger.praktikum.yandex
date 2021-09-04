import {HTTPMethod} from './http-method';

export interface HTTPRequest {
    origin: string;
    method: HTTPMethod;
    pathname: string[];
    queryParams?: {[key: string]: string | number | boolean};
    headers?: {[key: string]: string};
    timeout?: number;
    body?: object | string;
}
