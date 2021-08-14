import {pages} from '../../service/router/pages.config';
import {DomUtils} from '../../utils/test/dom-utils';
import {PageUtils} from '../../utils/test/page-utils';
import {authPageType} from './enums/auth-page-type.enum';
import {authPageFormTitle} from './enums/form-title.enum';

const titleSelector = 'main h1';
const authorizationFormSelector = 'app-form[name="authorization"]';
const registrationFormSelector = 'app-form[name="registration"]';
const authInputs = {
	login: `${authorizationFormSelector} input[name="login"]`,
	password: `${authorizationFormSelector} input[name="password"]`,
};
const registrationInputs = {
	first_name: `${registrationFormSelector} input[name="first_name"]`,
	second_name: `${registrationFormSelector} input[name="second_name"]`,
	login: `${registrationFormSelector} input[name="login"]`,
	email: `${registrationFormSelector} input[name="email"]`,
	password: `${registrationFormSelector} input[name="password"]`,
	phone: `${registrationFormSelector} input[name="phone"]`,
};

describe('component: page-auth', () => {
	const domUtils = new DomUtils(page);
	const pageUtils = new PageUtils(page);

	describe('authorisation', () => {
		beforeAll(async () => {
			await pageUtils.open(pages.auth);
		});

		it('has title', async () => {
			expect(await page.$(titleSelector)).toMatch(authPageFormTitle.authorization);
		});

		it('has forms', async () => {
			expect(await domUtils.hasElement(authorizationFormSelector)).toBe(true);
			expect(await domUtils.hasElement(registrationFormSelector)).toBe(true);
		});

		it('only the authorization form is visible', async () => {
			expect(await domUtils.hasAttribute(authorizationFormSelector, 'hidden')).toBe(false);
			expect(await domUtils.hasAttribute(registrationFormSelector, 'hidden')).toBe(true);
		});

		it('has inputs in form', async () => {
			expect(await domUtils.hasElement(authInputs.login)).toBe(true);
			expect(await domUtils.hasElement(authInputs.password)).toBe(true);
		});
	});

	describe('registration', () => {
		beforeAll(async () => {
			await pageUtils.open(`${pages.auth}?type=${authPageType.registration}`);
		});

		it('has title', async () => {
			expect(await page.$(titleSelector)).toMatch(authPageFormTitle.registration);
		});

		it('has forms', async () => {
			expect(await domUtils.hasElement(authorizationFormSelector)).toBe(true);
			expect(await domUtils.hasElement(registrationFormSelector)).toBe(true);
		});

		it('only the registration form is visible', async () => {
			expect(await domUtils.hasAttribute(authorizationFormSelector, 'hidden')).toBe(true);
			expect(await domUtils.hasAttribute(registrationFormSelector, 'hidden')).toBe(false);
		});

		it('has inputs in form', async () => {
			expect(await domUtils.hasElement(registrationInputs.first_name)).toBe(true);
			expect(await domUtils.hasElement(registrationInputs.second_name)).toBe(true);
			expect(await domUtils.hasElement(registrationInputs.login)).toBe(true);
			expect(await domUtils.hasElement(registrationInputs.email)).toBe(true);
			expect(await domUtils.hasElement(registrationInputs.phone)).toBe(true);
			expect(await domUtils.hasElement(registrationInputs.password)).toBe(true);
		});
	});
});
