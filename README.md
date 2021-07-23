Это учебный проект для курса Мидл-фронтенд от яндекс.практикума.
Тут планируется реализовать фронтенд для месседжера.

https://github.com/rizusss912/middle.messenger.praktikum.yandex/pull/1
https://github.com/rizusss912/middle.messenger.praktikum.yandex/pull/2

netlify: https://60e600be67201d00071cf6c1--rizus.netlify.app/

скрипты:
    npm run build : собирает проект в папку dist
    npm run deploy : устанавливает зависимости и собирает проект в dist
    npm run dev : запускает проект локально через parcel
    npm run start : собирает проект и раздаёт статику через express


const subject = new Subject<number>();

subject.asObserveble()
    .map(v => v * v)
    .filter(v => v % 2 === 0)
    .subscribe(v => console.log(v));

    var v = 0;
    setInterval(() => subject.next(v++), 1000);