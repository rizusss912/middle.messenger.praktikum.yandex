import {DomUtils} from '../../utils/test/dom-utils';
import {PageUtils} from '../../utils/test/page-utils';

describe('component: app-form', () => {
	const domUtils = new DomUtils(page);
	const pageUtils = new PageUtils(page);

	beforeAll(async () => {
		await pageUtils.open();
	});

	beforeEach(async () => {
		await domUtils.clearBody();
		await domUtils.appendChildToBody('app-form');
	});

	it('there is a form in the app-form', async () => {
		expect(await domUtils.hasElement('app-form form')).toBe(true);
	});

	it('the name attribute is inherited for the form', async () => {
		await domUtils.setAttribute('app-form', 'name', 'test');
		expect(await domUtils.getAttribute('app-form form', 'name')).toBe('test');

		await domUtils.removeAttribute('app-form', 'name');
		expect(await domUtils.getAttribute('app-form form', 'name')).toBe(null);
	});
});
