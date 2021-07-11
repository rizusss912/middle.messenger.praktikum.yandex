import {Component, CustomHTMLElement} from '../../utils/component';
import {RouterService} from '../../service/router/router.service';

import '../../components/input/app-input';
import '../../components/button/app-button';

import {pages} from '../../service/router/pages.config';

import {template} from './page-default.tmpl';

import './page-default.less';

const CODE_DESCRIPTION = {
    '404': 'Не туда попали',
    '500': 'Мы уже фиксим',
}

interface defaultPageQueryParams {
    code: string | number,
}

@Component<PageDefault>({
    name: 'page-default',
    template, 
})
export class PageDefault implements CustomHTMLElement {
        code: string | number;
        routerService: RouterService<defaultPageQueryParams>;

        constructor() {
            this.routerService = new RouterService();
        }

        onInit(): void {
            this.code = this.routerService.urlParams.queryParams.code || '404';
        }

        get description(): string {
            return CODE_DESCRIPTION[this.code]
                || CODE_DESCRIPTION[`${this.code[0]}00`]
                || 'Кажется, что-то пошло не так :(';
        }

        navigateToChats(): void {
            this.routerService.navigateTo(pages.chats);
        }
    }