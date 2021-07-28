export const template = `
    <main>
        <h1>
            {{$title}}
        </h1>

        <app-form name="authorization" hidden={{$isRegistration}} formGroup=[[authForm]]>
            <app-input slot="field" formControl=[[authForm.controls.login]]>
                <span slot="label">Логин</span>
            </app-input>
            <app-input slot="field" formControl=[[authForm.controls.password]]>
                <span slot="label">Пароль</span>
            </app-input>

            <app-button slot="submit" @disabledclick={{onDisabledClickFormAuthorization()}} disabled={{$isDisabledAuthorizationForm}} appearance="primary">
                <span slot="label">
                    Авторизация
                </span>
            </app-button>
        </app-form>

        <app-form name="registration" hidden={{$isAuthorization}} formGroup=[[registrationForm]]>
            <app-input slot="field" formControl=[[registrationForm.controls.first_name]]>
                <span slot="label">Имя</span>
            </app-input>
            <app-input slot="field" formControl=[[registrationForm.controls.second_name]]>
                <span slot="label">Фамилия</span>    
            </app-input>
            <app-input slot="field" formControl=[[registrationForm.controls.login]]>
                <span slot="label">Логин</span>
            </app-input>
            <app-input slot="field" formControl=[[registrationForm.controls.email]]>
                <span slot="label">Почта</span>    
            </app-input>
            <app-input slot="field" formControl=[[registrationForm.controls.password]]>
                <span slot="label">Пароль</span>    
            </app-input>
            <app-input slot="field" formControl=[[registrationForm.controls.phone]]>
                <span slot="label">Телефон</span> 
            </app-input>

            <app-button slot="submit" @disabledclick={{onDisabledClickFormRegistration()}} disabled={{$isDisabledRegistrationForm}} appearance="primary">
            <span slot="label">
                Регистрация
            </span>
        </app-button>
        </app-form>

        <app-button @click={{navigateTo()}} appearance="secondary">
            <span slot="label" hidden={{$isRegistration}}>
                Нет акаунта?
            </span>
            <span slot="label" hidden={{$isAuthorization}}>
                Войти
            </span>
        </app-button>
    </main>
`;
