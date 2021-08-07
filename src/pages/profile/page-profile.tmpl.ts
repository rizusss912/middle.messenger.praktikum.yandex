export const template = `
    <main>
        <section id="label">
            <img alt="avatar" src={{$userData.avatarUrl}}>
            <h1>{{$userData.login}}</h1>
        </section>

        <section class="content-wrapper">
            <user-data class="content" hidden-with-animtion={{$hideDataList}}></user-data>
            <form-user-data class="content" hidden-with-animtion={{$hideFormUserData}}></form-user-data>
            <form-password class="content" hidden-with-animtion={{$hideFormPassword}}></form-password>
        </section>
    </main>
`;
