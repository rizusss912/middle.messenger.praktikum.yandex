import { PageManager } from "../../../../utils/test/page-manager";

const form = {
    email: 'input[name="email"]',
    login: 'input[name="login"]',
    first_name: 'input[name="first_name"]',
    second_name: 'input[name="second_name"]',
    display_name: 'input[name="display_name"]',
    phone: 'input[name="phone"]',
}

describe('component: form-user-data', () => {
	const manager = new PageManager(page);

    beforeAll(async () => {
        await manager.open();

        manager.clearBody();
        manager.appendChildToBody('form-user-data');
    });

    it('has inputs in form', async () => {
        expect(await manager.hasElement(form.email)).toBe(true);
        expect(await manager.hasElement(form.login)).toBe(true);
        expect(await manager.hasElement(form.first_name)).toBe(true);
        expect(await manager.hasElement(form.second_name)).toBe(true);
        expect(await manager.hasElement(form.display_name)).toBe(true);
        expect(await manager.hasElement(form.phone)).toBe(true);
    });
});
