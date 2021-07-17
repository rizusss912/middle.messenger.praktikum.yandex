import {Service} from "../../utils/service";
import {HTMLPageConstructor, routerConfig} from "./router.config";
import {pages} from "./pages.config";
import { Subject } from "../../utils/observeble/subject";
import { Observable } from "../../utils/observeble/observeble";

let instance;

export interface urlParams<Query> {
    pathname: string;
    hash: string;
    queryParams: Query;
}

@Service()
export class RouterService<Query extends {}> {
    private readonly _popstate = new Subject<urlParams<Query>>();

        constructor() {
            if (instance) return instance;
            instance = this;
        }

        public static get config(): Record<pages, HTMLPageConstructor> {
            return routerConfig;
        }

        public get $popstate(): Observable<urlParams<Query>> {
            return this._popstate.asObserveble();
        }

        public get $path(): Observable<string> {
            return this.$popstate
                .map(urlParams => urlParams.pathname)
                .uniqueNext()
                .startWith(this.urlParams.pathname)
        }

        public get $queryParams(): Observable<Query> {
            return this.$popstate
                .map(urlParams => urlParams.queryParams)
                .uniqueNext(false, this.hasQueryParamsDiff)
                .startWith(this.urlParams.queryParams)
        }

        public get urlParams(): urlParams<Query> {
            var {hash, pathname, search} = window.location;
            var queryParams = search.match(/[^\?\&]*/g)
                .filter(value => value)
                .reduce((out, str) => {
                    var param = str.split('=');

                    if (param[1]) {
                        out[param[0]] = param[1];
                    }

                    return out;
                }, {}) as Query;

            hash = hash.replace('#', '');

            return {hash, pathname, queryParams};
        }

        //TODO нужно переходить на url не перезагружая страницу history.pushState
        public navigateTo(path: string = pages.main, query: Query = {} as Query, hash: string = ''): void {
            var queryStr = '';

            if (path[0] !== '/') {
                path = `/${path}`;
            }

            if (Object.keys(query).length !== 0) {
                queryStr = '?' + Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
            }

            if (hash && hash[0] !== '#') {
                hash = `#${hash}`;
            }

            history.pushState({}, "page", `${window.location.origin}${path}${queryStr}${hash}`);
            this.emitUrl(path, query, hash);
        }

        public getPageByPath(path: string = pages.main): HTMLPageConstructor {
            path = path.split('?')[0];

            if (path[path.length - 1] === '/' && path.length > 1) path = path.slice(0, -1);
            if (path[0] !== '/') path = `/${path}`;

            return RouterService.config[path] || RouterService.config[pages.default];
        }

        public getPage(): HTMLPageConstructor {
            return this.getPageByPath(this.urlParams.pathname);
        }

        private emitUrl(pathname: string = pages.main, queryParams: Query = {} as Query, hash: string = ''): void {
            if (pathname[0] !== '/') {
                pathname = `/${pathname}`;
            }

            hash = hash.replace('#', '');

            this._popstate.next({pathname, queryParams, hash});
        }

        private hasQueryParamsDiff(last: Query, next: Query): boolean {
            if (!last) return true;
            if (Object.keys(last).length !== Object.keys(next).length) return true;

            for (const key in last) {
                if (last[key] !== next[key]) return true;
            }

            return false;
        }
}