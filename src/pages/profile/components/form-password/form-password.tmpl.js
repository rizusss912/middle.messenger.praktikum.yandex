export const template = `
<section>
    <app-form name="password">
        <app-input slot="field" name="last">
            <span slot="label">Старый пароль</span>
        </app-input>
        <app-input slot="field" name="new">
            <span slot="label">Новый пароль</span>    
        </app-input>
        <app-input slot="field" name="repeat">
            <span slot="label">Повторите пароль</span>
        </app-input>
    </app-form>
</section>

<section id="footer-buttons">
    <ul class="field-list">
        <li>
            <app-button click={{onChangePassword()}} appearance="primary">
                <span slot="label">
                    Сохранить
                </span>
            </app-button>
        </li>
        <li>
            <app-button click={{onBack()}} appearance="error">
                <span slot="label">
                    Назад
                </span>
            </app-button>
        </li>
    </ul>
</section>
`;