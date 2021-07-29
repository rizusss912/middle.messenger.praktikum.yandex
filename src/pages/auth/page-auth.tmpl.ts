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

        <app-button @click={{navigateToAuthorization()}} appearance="secondary" hidden={{$isRegistration}}>
            <span slot="label">
                Войти
            </span>
        </app-button>

        <app-button @click={{navigateToRegistration()}} appearance="secondary" hidden={{$isAuthorization}}>
            <span slot="label">
                Нет акаунта?
            </span>
    </app-button>
    </main>
`;
