import {CustomElement} from '../../utils/custom-element.js';
import RouterService from '../../service/router/router.service.js';

import {template} from './page-profile.tmpl.js';

import '../../components/button/app-button.js';

import './page-profile.less';

export default CustomElement({
    name: 'page-profile',
    template, 
})(
    class PageProfile extends HTMLElement {
        router;
        userData;

        constructor() {
            super();

            this.router = new RouterService();
        }

        connectedCallback() {
            this.userData = this.getUserData();
            this.render();
        }

        onChangeData() {
            console.log('Изменение данных');
        }

        onChangePassword() {
            console.log('Смена пароля');
        }

        onExit() {
            console.log('Выход');
        }

        getUserData() {
            return {
                first_name: 'Вадим',
                last_name: 'Кошечкин',
                chat_name: 'Вадим',
                avatarUrl: 'https://sun1-87.userapi.com/s/v1/if1/75kO7SiwUAoiofoYlkEX407eGBwbwRzlxVgqp-j8n_5kJZsBMSTOpA1BrMezYnl6lhaecWsP.jpg?size=400x0&quality=96&crop=6,335,1299,1299&ava=1',
                email: 'Rizus912@yandex.ru',
                login: 'rizus',
                phone: '8-800-555-35-35',
            }
        }
    }
)