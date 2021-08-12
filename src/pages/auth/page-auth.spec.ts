import { pages } from '../../service/router/pages.config';
import { PageManager } from '../../utils/test/page-manager';
import { authPageType } from './enums/auth-page-type.enum';
import { authPageFormTitle } from './enums/form-title.enum';

const titleSelector = 'main h1';
const authorizationFormSelector = 'app-form[name="authorization"]';
const registrationFormSelector = 'app-form[name="registration"]';
const authInputs = {
    login: `${authorizationFormSelector} input[name="login"]`,
    password: `${authorizationFormSelector} input[name="password"]`,
}
const registrationInputs = {
    first_name: `${registrationFormSelector} input[name="first_name"]`,
    second_name: `${registrationFormSelector} input[name="second_name"]`,
    login: `${registrationFormSelector} input[name="login"]`,
    email: `${registrationFormSelector} input[name="email"]`,
    password: `${registrationFormSelector} input[name="password"]`,
    phone: `${registrationFormSelector} input[name="phone"]`,
}

describe('component: page-auth', () => {
	const manager = new PageManager(page);

    describe('authorisation', () => {
        beforeAll(async () => {
            await manager.open(pages.auth);
        });

        it('has title', async () => {
            expect(await page.$(titleSelector)).toMatch(authPageFormTitle.authorization);
        });

        it('has forms', async () => {
            expect(await manager.hasElement(authorizationFormSelector)).toBe(true);
            expect(await manager.hasElement(registrationFormSelector)).toBe(true);
        });

        it('only the authorization form is visible', async () => {
            expect(await manager.hasAttribute(authorizationFormSelector, 'hidden')).toBe(false);
            expect(await manager.hasAttribute(registrationFormSelector, 'hidden')).toBe(true);
        });

        it('has inputs in form', async () => {
            expect(await manager.hasElement(authInputs.login)).toBe(true);
            expect(await manager.hasElement(authInputs.password)).toBe(true);
        });
    });

    describe('registration', () => {
        beforeAll(async () => {
            await manager.open(`${pages.auth}?type=${authPageType.registration}`);
        });

        it('has title', async () => {
            expect(await page.$(titleSelector)).toMatch(authPageFormTitle.registration);
        });


        it('has forms', async () => {
            expect(await manager.hasElement(authorizationFormSelector)).toBe(true);
            expect(await manager.hasElement(registrationFormSelector)).toBe(true);
        });

        it('only the registration form is visible', async () => {
            expect(await manager.hasAttribute(authorizationFormSelector, 'hidden')).toBe(true);
            expect(await manager.hasAttribute(registrationFormSelector, 'hidden')).toBe(false);
        });

        it('has inputs in form', async () => {
            expect(await manager.hasElement(registrationInputs.first_name)).toBe(true);
            expect(await manager.hasElement(registrationInputs.second_name)).toBe(true);
            expect(await manager.hasElement(registrationInputs.login)).toBe(true);
            expect(await manager.hasElement(registrationInputs.email)).toBe(true);
            expect(await manager.hasElement(registrationInputs.phone)).toBe(true);
            expect(await manager.hasElement(registrationInputs.password)).toBe(true);
        });
    });
});
