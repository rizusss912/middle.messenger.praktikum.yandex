export const template = `
    <p>страничка с чатами</p>
    <button click={{navigateToAuth()}}>
        Перейти к страничке авторизации
    </button>
    <button click={{navigateToProfile()}} hidden={{$hidden}}>
        Перейти к страничке профиля
    </button>

    <p>{{text}}</p>
    <p>Шаблонизатор умеет подписываться на observeble</p>
    <p>Текущая дата: {{$data}}</p>
`;