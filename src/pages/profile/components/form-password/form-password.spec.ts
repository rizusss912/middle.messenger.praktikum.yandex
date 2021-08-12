import { PageManager } from "../../../../utils/test/page-manager";

const form = {
    oldPassword: 'input[name="oldPassword"]',
    newPassword: 'input[name="newPassword"]',
    repeatPassword: 'input[name="repeatPassword"]',
}

describe('component: form-password', () => {
	const manager = new PageManager(page);

    beforeAll(async () => {
        await manager.open();

        manager.clearBody();
        manager.appendChildToBody('form-password');
    });

    it('has inputs in form', async () => {
        expect(await manager.hasElement(form.oldPassword)).toBe(true);
        expect(await manager.hasElement(form.newPassword)).toBe(true);
        expect(await manager.hasElement(form.repeatPassword)).toBe(true);
    });
});
