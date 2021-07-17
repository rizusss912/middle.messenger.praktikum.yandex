export const template = `
<section>
    <app-form name="user_data">
        <app-input slot="field" name="email">
            <span slot="label">Почта</span>
        </app-input>
        <app-input slot="field" name="login">
            <span slot="label">Логин</span>    
        </app-input>
        <app-input slot="field" name="first_name">
            <span slot="label">Имя</span>
        </app-input>
        <app-input slot="field" name="second_name">
            <span slot="label">Фамилия</span>
        </app-input>
        <app-input slot="field" name="display_name">
            <span slot="label">Имя в чате</span>
        </app-input>
        <app-input slot="field" name="phone">
            <span slot="label">Телефон</span>
        </app-input>
    </app-form>
</section>

<section id="footer-buttons">
    <ul class="field-list">
        <li>
            <app-button @click={{onChangeData()}} appearance="primary">
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