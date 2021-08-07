import {FormGroup} from '../../../../utils/form/form-group';
import {Observable} from '../../../../utils/observeble/observeble';
import {component} from '../../../../utils/component';

import {formValidators} from '../../../../const/form-validators';

import {template} from './form-password.tmpl';

import './form-password.less';
import {ProfileContent} from '../../elements/profile-content';
import {ValidatorError} from '../../../../utils/form/validator-error';
import { ProfilePageManager } from '../../service/profile-page-manager';

// @ts-ignore никак не могу написать типы для component (
@component({
	name: 'form-password',
	template,
})
export class FormPassword extends ProfileContent {
        public readonly form = new FormGroup({
        	controls: {
        		oldPassword: {validators: formValidators.password},
        		newPassword: {validators: formValidators.password},
        		repeatPassword: {validators: formValidators.password},
        	},
        	fieldValidators: [
        		{
        			targets: ['repeatPassword'],
        			validators: [
        				({newPassword, repeatPassword}) => newPassword === repeatPassword
        					? null
        					: new ValidatorError('Пароли не совпадают'),
        			],
        		},
        		{
        			targets: ['repeatPassword'],
        			validators: [
        				({oldPassword, repeatPassword}) => oldPassword === repeatPassword
        					? new ValidatorError('Новый пароль не отличается от старого')
        					: null,
        			],
        		},
        		{
        			targets: ['newPassword'],
        			validators: [
        				({oldPassword, newPassword}) => oldPassword === newPassword
        					? new ValidatorError('Новый пароль не отличается от старого')
        					: null,
        			],
        		},
        	],
        });

        private readonly profilePageManager: ProfilePageManager;

        constructor() {
        	super();

        	this.profilePageManager = new ProfilePageManager();
        }

        static get observedAttributes(): string[] {
        	return super.observedAttributes;
        }

        public get $isInvalidForm(): Observable<boolean> {
        	return this.form.$isValid.map(isValid => !isValid);
        }

        public onBack(): void {
        	this.profilePageManager.goToUserData();
        }

        public onChangePassword(): void {
        	const {newPassword, oldPassword} = this.form.value;
			this.profilePageManager.changePassword({newPassword, oldPassword});
        }

        public onDisabledClick(): void {
        	this.form.touch();
        	this.form.shakingFirstInvalidField();
        }
}
