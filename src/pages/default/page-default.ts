import {component, CustomHTMLElement} from '../../utils/component';
import {RouterService} from '../../service/router/router.service';
import { defaultDescription } from './consts/default-description.const';

import '../../components/input/app-input';
import '../../components/button/app-button';

import {pages} from '../../service/router/pages.config';
import {template} from './page-default.tmpl';

import './page-default.less';

type defaultPageQueryParams = {
	code?: string,
}

@component({
	name: 'page-default',
	template,
})
export class PageDefault implements CustomHTMLElement {
        public code: number;
        public routerService: RouterService<defaultPageQueryParams>;

        constructor() {
        	this.routerService = new RouterService<defaultPageQueryParams>();
        }

        public onInit(): void {
        	this.code = Number(this.routerService.urlParams.queryParams.code) || 404;
        }

        public get description(): string {
        	return this.getDescriptionByCode(this.code)
                || this.getDescriptionByCode(this.floorToHundreds(this.code))
                || defaultDescription;
        }

        public navigateToChats(): void {
        	this.routerService.navigateTo(pages.chats);
        }

        public getDescriptionByCode(code: number): string | undefined {
        	switch (code) {
        		case 404: return 'Не туда попали';
        		case 500: return 'Мы уже фиксим';
        		default: return undefined;
        	}
        }

        public floorToHundreds(number: number): number {
        	return Math.floor(number / 100) * 100;
        }
}
