export const template = `
    <p>страничка с чатами</p>
    <button click={{navigateToAuth()}}>
        Перейти к страничке авторизации
    </button>
    <button click={{navigateToProfile()}} hidden=[[$value]]>
        Перейти к страничке профиля
    </button>

    <p>[[value]] {{valuel}}</p>
`;