export const template = `
<section id="data-list">
    <dl class="field-list">
        <dt class="text-primary">Почта</dt>
        <dd class="text-secondary">{{ $userData.email }}</dd>

        <dt class="text-primary">Логин</dt>
        <dd class="text-secondary">{{ $userData.login }}</dd>

        <dt class="text-primary">Имя</dt>
        <dd class="text-secondary">{{ $userData.first_name }}</dd>

        <dt class="text-primary">Фамилия</dt>
        <dd class="text-secondary">{{ $userData.second_name }}</dd>

        <dt class="text-primary">Имя в чате</dt>
        <dd class="text-secondary">{{ $userData.display_name }}</dd>

        <dt class="text-primary">Телефон</dt>
        <dd class="text-secondary">{{ $userData.phone }}</dd>
    </dl>
</section>

<section id="footer-buttons">
    <div class="buttons">
        <ul class="field-list">
            <li>
                <app-button @click={{onChangeData()}} appearance="secondary">
                    <span slot="label">
                        Изменить данные
                    </span>
                </app-button>
            </li>
            <li>
                <app-button @click={{onChangePassword()}} appearance="secondary">
                    <span slot="label">
                        Изменить пароль
                    </span>
                </app-button>
            </li>
            <li>
                <app-button @click={{onExit()}} appearance="error">
                    <span slot="label">
                        Выйти
                    </span>
                </app-button>
            </li>
        </ul>
    </div>
</section>
`;
