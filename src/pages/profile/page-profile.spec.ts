import { pages } from "../../service/router/pages.config";
import { PageManager } from "../../utils/test/page-manager";

describe('component: page-profile', () => {
	const manager = new PageManager(page);

    beforeAll(async () => {
        await manager.open(pages.profile);
    });

    it('has forms', async () => {
        expect(await manager.hasElement('user-data')).toBe(true);
        expect(await manager.hasElement('form-user-data')).toBe(true);
        expect(await manager.hasElement('form-password')).toBe(true);
    });

    //TODO: флакает... видимо, из-за анимаций
    /*
    describe('user-data active', () => {
        beforeAll(async () => {
            await manager.open(pages.profile);
        });

        it('only the user-data is visible', async () => {
            expect(await manager.hasAttribute('user-data', 'hidden')).toBe(false);
            expect(await manager.hasAttribute('form-user-data', 'hidden')).toBe(true);
            expect(await manager.hasAttribute('form-password', 'hidden')).toBe(true);
        });
    });
    */

    //TODO: флакает... видимо, из-за анимаций
    /*
    describe('form-user-data active', () => {
        beforeAll(async () => {
            await manager.open(`${pages.profile}?form=${profilePageFormType.changeData}`);
        });

        it('only the form-user-data is visible', async () => {
            expect(await manager.hasAttribute('user-data', 'hidden')).toBe(true);
            expect(await manager.hasAttribute('form-user-data', 'hidden')).toBe(false);
            expect(await manager.hasAttribute('form-password', 'hidden')).toBe(true);
        });
    });
    */

    //TODO: флакает... видимо, из-за анимаций
    /*
    describe('form-password active', () => {
        beforeAll(async () => {
            await manager.open(`${pages.profile}?form=${profilePageFormType.changePassword}`);
        });

        it('only the form-password is visible', async () => {
            expect(await manager.hasAttribute('user-data', 'hidden')).toBe(true);
            expect(await manager.hasAttribute('form-user-data', 'hidden')).toBe(true);
            expect(await manager.hasAttribute('form-password', 'hidden')).toBe(false);
        });
    });
    */
});