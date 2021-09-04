import {HTMLPageConstructor, routerConfig} from './router.config';
import {pages} from './pages.config';
import {Subject} from '../../utils/observeble/subject';
import {Observable} from '../../utils/observeble/observeble';

let instance: RouterService<{}>;

export interface urlParams<Query> {
    pathname: string;
    hash: string;
    queryParams: Query;
}

export class RouterService<Query extends {[key: string]: string}> {
    private readonly _popstate = new Subject<urlParams<Query>>();

    constructor() {
    	if (instance) {
    		return instance as RouterService<Query>;
    	}

    	instance = this as RouterService<{}>;

    	Observable.event(window, 'popstate').subscribe(() => this.onPopState());
    }

    public get config(): Record<pages, HTMLPageConstructor> {
    	return routerConfig;
    }

    public get $popstate(): Observable<urlParams<Query>> {
    	return this._popstate.asObserveble();
    }

    public get $path(): Observable<string> {
    	return this.$popstate
    		.map(urlParams => urlParams.pathname)
    		.startWith(this.urlParams.pathname)
    		.uniqueNext();
    }

    public get $queryParams(): Observable<Query> {
    	return this.$popstate
    		.map(urlParams => urlParams.queryParams)
    		.uniqueNext(false, this.hasQueryParamsDiff)
    		.startWith(this.urlParams.queryParams);
    }

    public get urlParams(): urlParams<Query> {
    	let {hash, pathname, search} = window.location;
    	const queryParams = (search.match(/[^?&]*/g) || [])
    		.filter(value => value)
    		.reduce((out, str) => {
    			const param: string[] = str.split('=');

    			if (param[1]) {
    				// @ts-ignore
    				out[param[0]] = param[1];
    			}

    			return out;
    		}, {}) as Query;

    	hash = hash.replace('#', '');

    	return {hash, pathname, queryParams};
    }

    // TODO нужно переходить на url не перезагружая страницу history.pushState
    public navigateTo(path: string = pages.main, query: Query = {} as Query, hash: string = ''): void {
    	let queryStr = '';

    	if (path[0] !== '/') {
    		path = `/${path}`;
    	}

    	if (Object.keys(query).length !== 0) {
    		queryStr = '?' + Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    	}

    	if (hash && hash[0] !== '#') {
    		hash = `#${hash}`;
    	}

    	history.pushState({}, 'page', `${window.location.origin}${path}${queryStr}${hash}`);
    	this.emitUrl(path, query, hash);
    }

    public getPageByPath(path: string = pages.main): HTMLPageConstructor {
    	path = path.split('?')[0];

    	if (path[path.length - 1] === '/' && path.length > 1) {
    		path = path.slice(0, -1);
    	}

    	if (path[0] !== '/') {
    		path = `/${path}`;
    	}

    	return this.config[path as pages] || this.config[pages.default];
    }

    public getPage(): HTMLPageConstructor {
    	return this.getPageByPath(this.urlParams.pathname);
    }

    private onPopState(): void {
    	this._popstate.next(this.urlParams);
    }

    private emitUrl(
		pathname: string = pages.main,
		queryParams: Query = {} as Query,
		hash: string = '',
	): void {
    	if (pathname[0] !== '/') {
    		pathname = `/${pathname}`;
    	}

    	hash = hash.replace('#', '');

    	this._popstate.next({pathname, queryParams, hash});
    }

    private hasQueryParamsDiff(last: Query, next: Query): boolean {
    	if (!last) {
    		return true;
    	}

    	if (Object.keys(last).length !== Object.keys(next).length) {
    		return true;
    	}

    	for (const key in last) {
    		if (last[key] !== next[key]) {
    			return true;
    		}
    	}

    	return false;
    }
}
