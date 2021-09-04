import {DomUtils} from '../../utils/test/dom-utils';
import {PageUtils} from '../../utils/test/page-utils';

const rundomUrl = '/path/to/the/missing/page';

const titleSelector = 'main #title';
const descriptionSelector = 'main #description';
const backButtonSelector = 'main #back';

describe('component: page-auth', () => {
	const domUtils = new DomUtils(page);
	const pageUtils = new PageUtils(page);

	beforeAll(async () => {
		await pageUtils.open(rundomUrl);
	});

	it('has elements', async () => {
		expect(await domUtils.hasElement(titleSelector)).toBe(true);
		expect(await domUtils.hasElement(descriptionSelector)).toBe(true);
		expect(await domUtils.hasElement(backButtonSelector)).toBe(true);
	});

	it('back button text', async () => {
		await expect(await page.$(backButtonSelector)).toMatch('Назад к чатам');
	});

	it('default page settings', async () => {
		await pageUtils.open(rundomUrl);

		await expect(await page.$(titleSelector)).toMatch('404');
		await expect(await page.$(descriptionSelector)).toMatch('Не туда попали');
	});

	describe('custom page settings', () => {
		beforeAll(async () => {
			await pageUtils.open(`${rundomUrl}?code=505`);
		});

		afterAll(async () => {
			await pageUtils.open(rundomUrl);
		});

		it('texts in page', async () => {
			await expect(await page.$(titleSelector)).toMatch('505');
			await expect(await page.$(descriptionSelector)).toMatch('Мы уже фиксим');
		});
	});
});
