export const template = `
    <main>
        <section id="label">
            <img alt="avatar" src={{userData.avatarUrl}}>
            <h1>{{userData.login}}</h1>
        </section>

        <user-data class="content" hidden={{$isNotDataList}}></user-data>
        <form-user-data class="content" hidden={{$isNotFormUserData}}></form-user-data>
        <form-password class="content" hidden={{$isNotFormPassword}}></form-password>
    </main>
`;
