export const template = `
    <main>
        <h1>
            {{ title }}
        </h1>

        <form name="auth">
            <app-input name="login"></app-input>
            <app-input name="logindd"></app-input>
        </form>

        <app-button>
            <span slot="title" hidden={{isRegistration}}>
                    Авторизация
            </span>
            <span slot="title" hidden={{isAuthorization}}>
                    Регистрация
            </span>
        </app-button>
        <app-button>
            <span slot="title" hidden={{isRegistration}}>
                Нет акаунта?
            </span>
            <span slot="title hidden={{isAuthorization}}">
                Войти
            </span>
        </app-button>
    </main>
`;