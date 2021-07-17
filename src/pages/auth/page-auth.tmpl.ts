export const template = `
    <main>
        <h1>
            {{ title }}
        </h1>

        <app-form name="authorization" hidden={{isRegistration}}>
            <app-input slot="field" name="login">
                <span slot="label">Логин</span>
            </app-input>
            <app-input slot="field" name="password">
                <span slot="label">Пароль</span>    
            </app-input>

            <app-button slot="field" click={{onAuthorization()}} appearance="primary">
                <span slot="label">Авторизация</span>
            </app-button>
        </app-form>

        <app-form name="registration" hidden={{isAuthorization}}>
            <app-input slot="field" name="first_name">
                <span slot="label">Имя</span>
            </app-input>
            <app-input slot="field" name="second_name">
                <span slot="label">Фамилия</span>    
            </app-input>
            <app-input slot="field" name="login">
                <span slot="label">Логин</span>
            </app-input>
            <app-input slot="field" name="email">
                <span slot="label">Почта</span>    
            </app-input>
            <app-input slot="field" name="password">
                <span slot="label">Пароль</span>    
            </app-input>
            <app-input slot="field" name="phone">
                <span slot="label">Телефон</span> 
            </app-input>

            <app-button slot="field" @click={{onAuthorization()}} appearance="primary">
                <span slot="label">Регистрация</span>
            </app-button>
        </app-form>

        <app-button @click={{navigateTo()}} appearance="secondary">
            <span slot="label" hidden={{isRegistration}}>
                Нет акаунта?
            </span>
            <span slot="label" hidden={{isAuthorization}}>
                Войти
            </span>
        </app-button>
    </main>
`;