import {Component, CustomHTMLElement} from '../../../../utils/component';

import {template} from './form-user-data.tmpl';

import {RouterService} from '../../../../service/router/router.service';
import {pages} from '../../../../service/router/pages.config';

import '../../../../components/form/app-form';
import '../../../../components/input/app-input';
import '../../../../components/button/app-button';

import './form-user-data.less';


@Component<FormUserData>({
    name: 'form-user-data',
    template, 
})
export class FormUserData implements CustomHTMLElement {
        routerService: RouterService<{}>;

        constructor() {
            this.routerService = new RouterService();
        }

        onInit(): void {}

        onBack(): void {
            this.routerService.navigateTo(pages.profile);
        }

        onChangeData(): void {
            console.log("смена пользовательских данных");
        }
    }
