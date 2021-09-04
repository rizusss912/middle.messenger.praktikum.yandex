export const template = `
    <main>
        <h1 id="title">{{ code }}</h1>
        <p id="description">{{ description }}</p>
        <app-button id="back" appearance="secondary" @click={{navigateToChats()}}>
            <span slot="label">Назад к чатам</span>
        </app-button>
    </main>
`;
