import {Component, CustomHTMLElement} from '../../utils/component';

import {RouterService} from '../../service/router/router.service';
import {pages} from '../../service/router/pages.config';

import '../../components/input/app-input';
import '../../components/form/app-form';
import '../../components/button/app-button';

import {template} from './page-auth.tmpl';

import './page-auth.less';
import { Observable } from '../../utils/observeble/observeble';

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
        private readonly routerService: RouterService<authPageQueryParams>;

        constructor() {
            this.routerService = new RouterService();
        }

        onInit(): void {}

        get $title(): Observable<string> {
            return this.$isRegistration.map(
                isRegistration => isRegistration ? FORM_TITLE.registration : FORM_TITLE.authorization,
                );
        }

        get $isRegistration(): Observable<boolean> {
            return this.routerService.$queryParams.map(query => query.type === authPageType.registration);
        }

        get $isAuthorization(): Observable<boolean> {
            return this.$isRegistration.map(isAuthorization => !isAuthorization);
        }

        navigateTo(): void {
            this.$isAuthorization
                .only(1)
                .subscribe(isAuthorization => {
                    if (isAuthorization) {
                        this.routerService.navigateTo(pages.auth, {type: authPageType.registration});
                    } else {
                        this.routerService.navigateTo(pages.auth);
                    }
                });
        }

        onAuthorization(): void {
            this.$isAuthorization
                .only(1)
                .subscribe(isAuthorization => {
                    if (isAuthorization) {
                        //TODO: собираем с формочки данные авторизации и идём на сервер
                    } else {
                        //TODO: собираем с формочки данные регистрации и идём на сервер
                    }
                });
        }
    }