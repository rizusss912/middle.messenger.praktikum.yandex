import {Service} from "../../../utils/service.js";

let instance;

export default Service() (
    class ProfileManagerService {
        handlers = [];

        constructor() {
            if (instance) return instance;

            instance = this;
        }

        get userData() {
            return {
                first_name: 'Вадим',
                second_name: 'Кошечкин',
                display_name: 'Вадим',
                avatarUrl: 'https://sun1-87.userapi.com/s/v1/if1/75kO7SiwUAoiofoYlkEX407eGBwbwRzlxVgqp-j8n_5kJZsBMSTOpA1BrMezYnl6lhaecWsP.jpg?size=400x0&quality=96&crop=6,335,1299,1299&ava=1',
                email: 'Rizus912@yandex.ru',
                login: 'rizus',
                phone: '8-800-555-35-35',
            }
        }

        onUserDataChanged(handler) {
            this.handlers.push(handler);
        }

        
    }
)