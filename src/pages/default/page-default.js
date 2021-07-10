import {CustomElement} from '../../utils/custom-element.js';
import RouterService from '../../service/router/router.service.js';

import '../../components/input/app-input.js';
import '../../components/button/app-button.js';

import {pages} from '../../service/router/pages.config.js';

import {template} from './page-default.tmpl.js';

import './page-default.less';

const CODE_DESCRIPTION = {
    '404': 'Не туда попали',
    '500': 'Мы уже фиксим',
}

export default CustomElement({
    name: 'page-default',
    template, 
})(
    class PageDefault extends HTMLElement {
        code;
        router;

        constructor() {
            super();

            this.router = new RouterService();
        }

        get description() {
            return CODE_DESCRIPTION[this.code]
                || CODE_DESCRIPTION[`${this.code[0]}00`]
                || 'Кажется, что-то пошло не так :(';
        }

        connectedCallback() {
            this.code = this.router.urlParams.queryParams.code || '404';
            this.render();
        }

        navigateToChats() {
            this.router.navigateTo(pages.chats);
        }
    }
)