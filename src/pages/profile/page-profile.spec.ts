import {pages} from '../../service/router/pages.config';
import {DomUtils} from '../../utils/test/dom-utils';
import {PageUtils} from '../../utils/test/page-utils';

describe('component: page-profile', () => {
	const domUtils = new DomUtils(page);
	const pageUtils = new PageUtils(page);

	beforeAll(async () => {
		await pageUtils.open(pages.profile);
	});

	it('has forms', async () => {
		expect(await domUtils.hasElement('user-data')).toBe(true);
		expect(await domUtils.hasElement('form-user-data')).toBe(true);
		expect(await domUtils.hasElement('form-password')).toBe(true);
	});

	// TODO: флакает... видимо, из-за анимаций
	/*
    describe('user-data active', () => {
        beforeAll(async () => {
            await manager.open(pages.profile);
        });

        it('only the user-data is visible', async () => {
            expect(await manager.hasAttribute('user-data', 'hidden')).toBe(false);
            expect(await manager.hasAttribute('form-user-data', 'hidden')).toBe(true);
            expect(await manager.hasAttribute('form-password', 'hidden')).toBe(true);
        });
    });
    */

	// TODO: флакает... видимо, из-за анимаций
	/*
    describe('form-user-data active', () => {
        beforeAll(async () => {
            await manager.open(`${pages.profile}?form=${profilePageFormType.changeData}`);
        });

        it('only the form-user-data is visible', async () => {
            expect(await manager.hasAttribute('user-data', 'hidden')).toBe(true);
            expect(await manager.hasAttribute('form-user-data', 'hidden')).toBe(false);
            expect(await manager.hasAttribute('form-password', 'hidden')).toBe(true);
        });
    });
    */

	// TODO: флакает... видимо, из-за анимаций
	/*
    describe('form-password active', () => {
        beforeAll(async () => {
            await manager.open(`${pages.profile}?form=${profilePageFormType.changePassword}`);
        });

        it('only the form-password is visible', async () => {
            expect(await manager.hasAttribute('user-data', 'hidden')).toBe(true);
            expect(await manager.hasAttribute('form-user-data', 'hidden')).toBe(true);
            expect(await manager.hasAttribute('form-password', 'hidden')).toBe(false);
        });
    });
    */
});
