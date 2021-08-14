import {pages} from './service/router/pages.config';
import {DomUtils} from './utils/test/dom-utils';
import {HistoryUtils} from './utils/test/history-utils';
import {PageUtils} from './utils/test/page-utils';

describe('component: app-root', () => {
	const domUtils = new DomUtils(page);
	const pageUtils = new PageUtils(page);
	const historyUtils = new HistoryUtils(page);

	beforeAll(async () => {
		await pageUtils.open();
	});

	it('has app-root', async () => {
		expect(await domUtils.hasElement('app-root')).toBe(true);
		expect(await domUtils.hasAttribute('app-root', 'hidden')).toBe(false);
	});

	it('has main page', async () => {
		expect(await domUtils.hasElement('page-main')).toBe(true);
		expect(await domUtils.hasAttribute('page-main', 'hidden')).toBe(false);
	});

	describe('content changes when the history changes', () => {
		// PushState не вызывает popstate, поэтому сначала заполняем историю,
		// а потом идём по ней назад через history.back()

		// TODO: Тест флакает, поэтому не дублируем для других страниц
		it('page-auth', async () => {
			await pageUtils.open();
			await historyUtils.pushState(pages.auth);
			await historyUtils.back();
			await historyUtils.forward();

			expect(await domUtils.hasElement('page-auth')).toBe(true);
			expect(await domUtils.hasAttribute('page-auth', 'hidden')).toBe(false);
		});
	});
});
