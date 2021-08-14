Это учебный проект для курса Мидл-фронтенд от яндекс.практикума.
Тут планируется реализовать фронтенд для месседжера.

https://github.com/rizusss912/middle.messenger.praktikum.yandex/pull/1

netlify: https://60e600be67201d00071cf6c1--rizus.netlify.app/

скрипты:
    npm run build : собирает проект в папку dist
    npm run deploy : устанавливает зависимости и собирает проект в dist
    npm run dev : запускает проект локально через parcel
    npm run start : собирает проект и раздаёт статику через express
    npm run eslint : Запускает линтер для ts-файлов
    npm run eslint:fix : Запускает линтер для ts-файлов и пытается починить ошибки в них
    npm run stylelint : Запускает линтер для less-файлов
    npm run lint : Запускает все линтеры проекта
    npm run test:integrations : Запускает интеграционные тесты (WARNING: для них должен быть запущен сервер npm run start)
    npm run test:components : Запускает компонентные тесты
    npm run test : Запускает все тесты

В третьем спринте я очень много времени потратил на организацию тестов. Основная проблема была в том, что я использую customElements для создания компонентов и их тяжело протестировать. После долгих экспериментов я решил заиспользовть в проекте
puppeteer для честных интеграционных тестов, которые гоняются через консоль браузера.

Минусы такого решения:
    1) В зависимость к проекту ставится chromium на 140мб
    2) Есть флакающие тесты (пока только один)
    3) Для интеграционных тестов должен быть запущен сервер (npm run start)
    4) На страницах есть Guard-ы, которые не дадут отрендерить страничку, если мы, к примеру, не авторизованны,
        но поскольку из-за на момент инициализации приложения мы не можем узнать состояние авторизации (куки файлы httponly),
        фактически Guard-ы на авторизацию не срабатывают, но эта проблема может возникнуть в будущем.
Плюсы:
    1) Возможность покрытие почти любого процесса тестами.

Как мы видим, плюсов, очевидно, больше чем минусов)

Интеграционные тесты лежат в файлах *.spec.ts, а компонентные в *.test.ts.
У меня осталось не так много времени, поэтому текущее покрытие тестами скорее демонстрации возможностей, чем готовая работа.
Я бы хотел получить комментарий о том, какие файлы/части приложения нужно покрыть тестами, чтобы пройти ревью.


Немного об архитектуре:
    Все компоненты/стрвктуры из компонентов общаются с остальными частями приложения только через свой *Manager.ts
    *Manager.ts ходят только в сервисы (*Service.ts) и store
    В сторе все состояния запросов к API обёрнуты в интерфейс Data
    Ещё в проекте есть интерсепторы для перехвата запросов/ответов API и Guard-ы которые могут не дать отрендорить компонент при условии

Ещё у меня есть своя реализация eventBus:
    Subject умеет отправлять новое сообщение подпищикам и отдавать Observeble на себя
    Observeble - наблюдатель за событиями. На него можно подписаться или модифицировать и получить новый Observeble
    Subscription - подписка на Observeble. Пока нужна только чтобы можно было отписаться от наблюдателя
