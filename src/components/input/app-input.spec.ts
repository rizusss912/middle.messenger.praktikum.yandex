import {PageManager} from '../../utils/test/page-manager';

describe('component: app-input', () => {
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
});
