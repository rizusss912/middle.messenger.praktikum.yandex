import {Service} from "../../utils/service";
import {HTMLPageConstructor, routerConfig} from "./router.config";
import {pages} from "./pages.config";

let instance;

export interface urlParams<Query> {
    pathname: string;
    origin: string;
    hash: string;
    queryParams: Query;
}

@Service()
export class RouterService<Query extends {}> {
        constructor() {
            if (instance) return instance;
            instance = this;
        }

        public static get config(): Record<pages, HTMLPageConstructor> {
            return routerConfig;
        }

        public get urlParams(): urlParams<Query> {
            var {hash, pathname, origin, search} = window.location;
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

            return {hash, pathname, origin, queryParams};
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

            window.location.assign(`${window.location.origin}${path}${queryStr}${hash}`);
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
}