import {Component, CustomHTMLElement} from '../../../../utils/component';

import {template} from './form-password.tmpl';

import {RouterService} from '../../../../service/router/router.service';
import {pages} from '../../../../service/router/pages.config';

import './form-password.less';

@Component<FormPassword>({
    name: 'form-password',
    template, 
})
export class FormPassword implements CustomHTMLElement {
        routerService: RouterService<{}>;

        constructor() {
            this.routerService = new RouterService();
        }

        onInit(): void {}

        onBack(): void {
            this.routerService.navigateTo(pages.profile);
        }

        onChangePassword(): void {
            console.log('Смена пароля');
        }
    }