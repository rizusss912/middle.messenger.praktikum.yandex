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

            if (Object.keys(query) !== 0) {
                queryStr = '?' + Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
            }

            window.location.assign(`${window.location.origin}${path}${queryStr}`);
        }

        getPageByPath(path = pages.main) {
            return this.config[path] || this.config[pages.default];
        }
});
