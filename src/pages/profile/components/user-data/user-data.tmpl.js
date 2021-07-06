export const template = `
<section id="data-list">
    <ul class="field-list">
        <li>
            <p class="text-primary">Почта</p>
            <p class="text-secondary">{{ userData.email }}</p>
        </li>
        <li>
            <p class="text-primary">Логин</p>
            <p class="text-secondary">{{ userData.login }}</p>
        </li>
        <li>
            <p class="text-primary">Имя</p>
            <p class="text-secondary">{{ userData.first_name }}</p>
        </li>
        <li>
            <p class="text-primary">Фамилия</p>
            <p class="text-secondary">{{ userData.second_name }}</p>
        </li>
        <li>
            <p class="text-primary">Имя в чате</p>
            <p class="text-secondary">{{ userData.display_name }}</p>
        </li>
            <li>
            <p class="text-primary">Телефон</p>
            <p class="text-secondary">{{ userData.phone }}</p>
        </li>
    </ul>
</section>

<section id="footer-buttons">
    <ul class="field-list">
        <li>
            <app-button click={{onChangeData()}} appearance="secondary">
                <span slot="title">
                    Изменить данные
                </span>
            </app-button>
        </li>
        <li>
            <app-button click={{onChangePassword()}} appearance="secondary">
                <span slot="title">
                    Изменить пароль
                </span>
            </app-button>
        </li>
        <li>
            <app-button click={{onExit()}} appearance="error">
                <span slot="title">
                    Выйти
                </span>
            </app-button>
        </li>
    </ul>
</section>
`;