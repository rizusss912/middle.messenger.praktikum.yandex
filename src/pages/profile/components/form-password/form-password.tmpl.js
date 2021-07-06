export const template = `
<section>
    <app-form name="password">
        <app-input slot="field" name="last">
            <span slot="title">Старый пароль</span>
        </app-input>
        <app-input slot="field" name="new">
            <span slot="title">Новый пароль</span>    
        </app-input>
        <app-input slot="field" name="repeat">
            <span slot="title">Повторите пароль</span>
        </app-input>
    </app-form>
</section>

<section id="footer-buttons">
    <ul class="field-list">
        <li>
            <app-button click={{onChangePassword()}} appearance="primary">
                <span slot="title">
                    Сохранить
                </span>
            </app-button>
        </li>
        <li>
            <app-button click={{onBack()}} appearance="error">
                <span slot="title">
                    Назад
                </span>
            </app-button>
        </li>
    </ul>
</section>
`;