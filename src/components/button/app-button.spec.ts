import {DomUtils} from '../../utils/test/dom-utils';
import {PageUtils} from '../../utils/test/page-utils';

describe('component: app-button', () => {
	const domUtils = new DomUtils(page);
	const pageUtils = new PageUtils(page);

	beforeAll(async () => {
		await pageUtils.open();
	});

	beforeEach(async () => {
		await domUtils.clearBody();
		await domUtils.appendChildToBody('app-button');
	});

	it('there is a button in the app-button', async () => {
		expect(await domUtils.hasElement('app-button button')).toBe(true);
	});
});
