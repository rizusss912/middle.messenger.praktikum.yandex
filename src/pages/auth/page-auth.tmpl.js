export const template = `
    <main>
        <h1>
            {{ title }}
        </h1>

        <app-form name="authorization" hidden={{isRegistration}}>
            <app-input slot="field" name="login">
                <span slot="title">Логин</span>
            </app-input>
            <app-input slot="field" name="password">
                <span slot="title">Пароль</span>    
            </app-input>
        </app-form>

        <app-form name="registration" hidden={{isAuthorization}}>
            <app-input slot="field" name="first_name">
                <span slot="title">Имя</span>
            </app-input>
            <app-input slot="field" name="second_name">
            <span slot="title">Фамилия</span>    
            </app-input>
            <app-input slot="field" name="login">
                <span slot="title">Логин</span>
            </app-input>
            <app-input slot="field" name="email">
                <span slot="title">Почта</span>    
            </app-input>
            <app-input slot="field" name="password">
                <span slot="title">Пароль</span>    
            </app-input>
            <app-input slot="field" name="phone">
                <span slot="title">Телефон</span> 
            </app-input>
        </app-form>

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