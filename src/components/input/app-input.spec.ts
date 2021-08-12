import {PageManager} from '../../utils/test/page-manager';

describe('app-input', () => {
	const manager = new PageManager(page);

	beforeAll(async () => {
		await manager.open();
	});

	beforeEach(async () => {
		await manager.clearBody();
		await manager.appendChildToBody('app-input');
	});

	it('there is a input in the app-input', async () => {
		expect(await manager.hasElement('app-input input')).toBe(true);
	});

	it('there is a label in the app-input', async () => {
		expect(await manager.hasElement('app-input label')).toBe(true);
	});

	describe('name attribute', () => {
		beforeEach(async () => {
			await manager.setAttribute('app-input', 'name', 'test');
		});

		it('the name attribute is inherited for the input', async () => {
			expect(await manager.getAttribute('app-input input', 'name')).toBe('test');
		});

		it('the name attribute is inherited for the label', async () => {
			expect(await manager.getAttribute('app-input label', 'name')).toBe('test');
		});
	});
});
