import {Component, CustomHTMLElement} from '../../utils/component';

import {RouterService} from '../../service/router/router.service';
import {pages} from '../../service/router/pages.config';

import '../../components/input/app-input';
import '../../components/form/app-form';
import '../../components/button/app-button';

import {template} from './page-auth.tmpl';

import './page-auth.less';

enum authPageType {
    registration = 'registration',
};

type authPageQueryParams = {
    type?: authPageType,
}

const FORM_TITLE = {
    registration: 'Регистрация',
    authorization: 'Вход',
}

@Component<PageAuth>({
    name: 'page-auth',
    template,
})
export class PageAuth implements CustomHTMLElement {
        router: RouterService<authPageQueryParams>;

        constructor() {
            this.router = new RouterService();
        }

        onInit(): void {}

        get title(): string {
            return this.isRegistration ? FORM_TITLE.registration : FORM_TITLE.authorization;
        }

        get isRegistration(): boolean {
            return this.router.urlParams.queryParams?.type === authPageType.registration;
        }

        get isAuthorization(): boolean {
            return !this.isRegistration;
        }

        navigateTo(): void {
            if (this.isAuthorization) {
                this.router.navigateTo(pages.auth, {type: authPageType.registration});
            } else {
                this.router.navigateTo(pages.auth);
            }
        }

        onAuthorization(): void {
            console.log(this.isAuthorization ? "авторизация": "регистрация");
            if (this.isAuthorization) {
                //TODO: собираем с формочки данные авторизации и идём на сервер
            } else {
                //TODO: собираем с формочки данные регистрации и идём на сервер
            }
        }
    }