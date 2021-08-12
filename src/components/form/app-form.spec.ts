import {PageManager} from '../../utils/test/page-manager';

describe('app-form', () => {
	const manager = new PageManager(page);

	beforeAll(async () => {
		await manager.open();
	});

	beforeEach(async () => {
		await manager.clearBody();
		await manager.appendChildToBody('app-form');
	});

	it('there is a form in the app-form', async () => {
		expect(await manager.hasElement('app-form form')).toBe(true);
	});

	it('the name attribute is inherited for the form', async () => {
		await manager.setAttribute('app-form', 'name', 'test');
		expect(await manager.getAttribute('app-form form', 'name')).toBe('test');

		await manager.removeAttribute('app-form', 'name');
		expect(await manager.getAttribute('app-form form', 'name')).toBe(null);
	});
});
