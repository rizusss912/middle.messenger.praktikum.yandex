import {DomUtils} from '../../utils/test/dom-utils';
import {PageUtils} from '../../utils/test/page-utils';

describe('component: app-input', () => {
	const domUtils = new DomUtils(page);
	const pageUtils = new PageUtils(page);

	beforeAll(async () => {
		await pageUtils.open();
	});

	beforeEach(async () => {
		await domUtils.clearBody();
		await domUtils.appendChildToBody('app-input');
	});

	it('there is a input in the app-input', async () => {
		expect(await domUtils.hasElement('app-input input')).toBe(true);
	});

	it('there is a label in the app-input', async () => {
		expect(await domUtils.hasElement('app-input label')).toBe(true);
	});
});
