export interface Interceptor {
    interceptRequest(request: XMLHttpRequest, event: ProgressEvent): void;
}
