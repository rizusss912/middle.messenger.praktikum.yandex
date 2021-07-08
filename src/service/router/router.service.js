import {Service} from "../../utils/service.js";
import {routerConfig} from "./router.config.js";
import {pages} from "./pages.config.js";

let instance;

export default Service() (
    class RouterService {

        constructor() {
            if (instance) return instance;

            instance = this;
        }

        get config() {
            return routerConfig;
        }

        get urlParams() {
            var {hash, pathname, origin, search} = window.location;
            var queryParams = search.match(/[^\?\&]*/g)
                .filter(value => value)
                .reduce((out, str) => {
                    var param = str.split('=');

                    if (param[1]) {
                        out[param[0]] = param[1];
                    }

                    return out;
                }, {});

            hash = hash.replace('#', '');

            return {hash, pathname, origin, queryParams};
        }

        //TODO нужно переходить на url не перезагружая страницу history.pushState
        navigateTo(path = pages.main, query = {}, hash = '') {
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

        getPageByPath(path = pages.main) {
            path = path.split('?')[0];
            if (path[path.length - 1] === '/' && path.length > 1) path = path.slice(0, -1);
            if (path[0] !== '/') path = `/${path}`;
            return this.config[path] || this.config[pages.default];
        }
});