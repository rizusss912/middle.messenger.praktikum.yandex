export const template = `
    <p>страничка с чатами</p>
    <button @click={{navigateToAuth()}}>
        Перейти к страничке авторизации
    </button>
    <button @click={{navigateToProfile()}}>
        Перейти к страничке профиля
    </button>

    <p>{{text}}</p>
    <p>Шаблонизатор умеет подписываться на observeble</p>
    <p>Текущая дата: {{$data}}</p>

    <button appearance="secondary" @click={{open()}}>
        Открыть диалог
    </button>

    <dialog open={{$isOpenDialog}}>
        <form method method="dialog">
            <input>
            <input>

            <button @click={{close()}}>
                Закрыть диалог
            </button>
        </form>
    </dialog>
`;
