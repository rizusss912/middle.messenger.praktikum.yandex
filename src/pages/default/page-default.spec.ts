import { PageManager } from '../../utils/test/page-manager';

const rundomUrl = '/path/to/the/missing/page';

const titleSelector = 'main #title';
const descriptionSelector = 'main #description';
const backButtonSelector = 'main #back';

describe('component: page-auth', () => {
	const manager = new PageManager(page);

    beforeAll(async () => {
        await manager.open(rundomUrl);
    });

    it('has elements', async () => {
        expect(await manager.hasElement(titleSelector)).toBe(true);
        expect(await manager.hasElement(descriptionSelector)).toBe(true);
        expect(await manager.hasElement(backButtonSelector)).toBe(true);
    });

    it('back button text', async () => {
        await expect(await page.$(backButtonSelector)).toMatch('Назад к чатам');
    });

    it('default page settings', async () => {
        await manager.open(rundomUrl);

        await expect(await page.$(titleSelector)).toMatch('404');
        await expect(await page.$(descriptionSelector)).toMatch('Не туда попали');
    });

    describe('custom page settings', () => {
        beforeAll(async () => {
            await manager.open(`${rundomUrl}?code=505`);
        });

        it('texts in page', async () => {
            await expect(await page.$(titleSelector)).toMatch('505');
            await expect(await page.$(descriptionSelector)).toMatch('Мы уже фиксим');
        });

        afterAll(async () => {
            await manager.open(rundomUrl);
        });
    });    
});
