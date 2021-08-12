import { PageManager } from "../../utils/test/page-manager";

describe('app-button', () => {
    const manager = new PageManager(page);

    beforeAll(async () => {
        await manager.open();
    })

    beforeEach(async () => {
        await manager.clearBody();
        await manager.appendChildToBody('app-button');
    });

    it('there is a button in the app-button', async () => {
        expect(await manager.hasElement('app-button button')).toBe(true);
    });
})