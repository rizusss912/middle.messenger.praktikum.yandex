export const template = `
    <p>страничка с чатами</p>
    <button @click={{navigateToAuth()}}>
        Перейти к страничке авторизации
    </button>
    <button @click={{navigateToProfile()}}>
        Перейти к страничке профиля
    </button>
`;
