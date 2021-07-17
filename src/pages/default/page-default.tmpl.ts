export const template = `
    <main>
        <h1>{{ code }}</h1>
        <p>{{ description }}</p>
        <app-button appearance="secondary" @click={{navigateToChats()}}>
            <span slot="label">Назад к чатам</span>
        </app-button>
    </main>
`;