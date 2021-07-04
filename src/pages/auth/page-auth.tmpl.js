export const template = `
    <main>
        <h1>
            {{ title }}
        </h1>

        <form name="authorization" hidden={{isRegistration}}>
            <app-input name="login">
                <span slot="title">Логин</span>
            </app-input>
            <app-input name="password">
                <span slot="title">Пароль</span>    
            </app-input>
        </form>

        <form name="registration" hidden={{isAuthorization}}>
            <app-input name="first_name">
                <span slot="title">Имя</span>
            </app-input>
            <app-input name="second_name">
            <span slot="title">Фамилия</span>    
            </app-input>
            <app-input name="login">
                <span slot="title">Логин</span>
            </app-input>
            <app-input name="email">
                <span slot="title">Почта</span>    
            </app-input>
            <app-input name="password">
                <span slot="title">Пароль</span>    
            </app-input>
            <app-input name="phone">
                <span slot="title">Телефон</span> 
            </app-input>
        </form>

        <app-button click={{onAuthorization()}} appearance="primary">
            <span slot="title" hidden={{isRegistration}}>
                    Авторизация
            </span>
            <span slot="title" hidden={{isAuthorization}}>
                    Регистрация
            </span>
        </app-button>

        <app-button click={{navigateTo()}} appearance="secondary">
            <span slot="title" hidden={{isRegistration}}>
                Нет акаунта?
            </span>
            <span slot="title" hidden={{isAuthorization}}>
                Войти
            </span>
        </app-button>
    </main>
`;