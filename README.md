netlify: https://60e600be67201d00071cf6c1--rizus.netlify.app/

скрипты:
    build: собирает проект в папку dist
    deploy: устанавливает зависимости и собирает проект в dist
    dev: запускает проект локально через parcel
    start: собирает проект и раздаёт статику через express

WARNING:
Я хотел раздвать один html файл и при переходе между страничками подгружать компонент нужной странички, но не успел сделать эту логику + только сейчас заметил что на netlify и express переходы из-за этого не работают. Сейчас на другие страничку можно попать только в dev сборке.
Если это критично, исправлю всё ковторому ревью + хотелось бы получить совет как лучше поступить.