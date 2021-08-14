import {DomUtils} from '../../../../utils/test/dom-utils';
import {PageUtils} from '../../../../utils/test/page-utils';

const form = {
	email: 'input[name="email"]',
	login: 'input[name="login"]',
	first_name: 'input[name="first_name"]',
	second_name: 'input[name="second_name"]',
	display_name: 'input[name="display_name"]',
	phone: 'input[name="phone"]',
};

describe('component: form-user-data', () => {
	const domUtils = new DomUtils(page);
	const pageUtils = new PageUtils(page);

	beforeAll(async () => {
		await pageUtils.open();

		domUtils.clearBody();
		domUtils.appendChildToBody('form-user-data');
	});

	it('has inputs in form', async () => {
		expect(await domUtils.hasElement(form.email)).toBe(true);
		expect(await domUtils.hasElement(form.login)).toBe(true);
		expect(await domUtils.hasElement(form.first_name)).toBe(true);
		expect(await domUtils.hasElement(form.second_name)).toBe(true);
		expect(await domUtils.hasElement(form.display_name)).toBe(true);
		expect(await domUtils.hasElement(form.phone)).toBe(true);
	});
});
