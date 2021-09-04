import {DomUtils} from '../../../../utils/test/dom-utils';
import {PageUtils} from '../../../../utils/test/page-utils';

const form = {
	oldPassword: 'input[name="oldPassword"]',
	newPassword: 'input[name="newPassword"]',
	repeatPassword: 'input[name="repeatPassword"]',
};

describe('component: form-password', () => {
	const domUtils = new DomUtils(page);
	const pageUtils = new PageUtils(page);

	beforeAll(async () => {
		await pageUtils.open();

		domUtils.clearBody();
		domUtils.appendChildToBody('form-password');
	});

	it('has inputs in form', async () => {
		expect(await domUtils.hasElement(form.oldPassword)).toBe(true);
		expect(await domUtils.hasElement(form.newPassword)).toBe(true);
		expect(await domUtils.hasElement(form.repeatPassword)).toBe(true);
	});
});
