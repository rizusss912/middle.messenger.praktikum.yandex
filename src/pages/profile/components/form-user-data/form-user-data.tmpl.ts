export const template = `
<section>
    <app-form name="user_data">
        <app-input slot="field" formControl=[[form.controls.email]]>
            <span slot="label">Почта</span>
        </app-input>
        <app-input slot="field" formControl=[[form.controls.login]]>
            <span slot="label">Логин</span>    
        </app-input>
        <app-input slot="field" formControl=[[form.controls.first_name]]>
            <span slot="label">Имя</span>
        </app-input>
        <app-input slot="field" formControl=[[form.controls.second_name]]>
            <span slot="label">Фамилия</span>
        </app-input>
        <app-input slot="field" formControl=[[form.controls.display_name]]>
            <span slot="label">Имя в чате</span>
        </app-input>
        <app-input slot="field" formControl=[[form.controls.phone]]>
            <span slot="label">Телефон</span>
        </app-input>
    </app-form>
</section>

<section id="footer-buttons">
    <ul class="field-list">
        <li>
            <app-button @click={{onChangeData()}} @disabledclick={{onDisabledClick()}} disabled={{$isInvalidForm}} onDisabledClick appearance="primary">
                <span slot="label">
                    Сохранить
                </span>
            </app-button>
        </li>
        <li>
            <app-button @click={{onBack()}} appearance="error">
                <span slot="label">
                    Назад
                </span>
            </app-button>
        </li>
    </ul>
</section>
`;