import {FormGroup} from '../../../../utils/form/form-group';
import {Observable} from '../../../../utils/observeble/observeble';
import {component} from '../../../../utils/component';

import {formValidators} from '../../../../const/form-validators';

import {template} from './form-password.tmpl';

import './form-password.less';
import {ProfileContent} from '../../elements/profile-content';
import { ProfileManagerService } from '../../service/profile-manager.service';
import { ValidatorError } from '../../../../utils/form/validator-error';

//@ts-ignore никак не могу написать типы для component (
@component({
	name: 'form-password',
	template,
})
export class FormPassword extends ProfileContent {
        public readonly form = new FormGroup({
        	controls: {
        		last: {validators: formValidators.password},
        		next: {validators: formValidators.password},
        		repeat: {validators: formValidators.password},
        	},
                fieldValidators: [
                        {
                                targets: ['repeat'],
                                validators: [
                                        ({next, repeat}) => next !== repeat
                                                ? new ValidatorError('Пароли не совпадают')
                                                : null,
                                ],
                        },
                        {
                                targets: ['repeat'],
                                validators: [
                                        ({last, repeat}) => last === repeat
                                                ? new ValidatorError('Новый пароль не отличается от старого')
                                                : null,
                                ],
                        },
                        {
                                targets: ['next'],
                                validators: [
                                        ({last, next}) => last === next
                                                ? new ValidatorError('Новый пароль не отличается от старого')
                                                : null,
                                ],
                        },
                ]
        });

        private readonly profileManagerService: ProfileManagerService;

        constructor() {
                super();

        	this.profileManagerService = new ProfileManagerService();
        }

        static get observedAttributes(): string[] {
                return super.observedAttributes;
        }

        public get $isInvalidForm(): Observable<boolean> {
        	return this.form.$isValid.map(isValid => !isValid);
        }

        public onInit(): void {}

        public onBack(): void {
        	this.profileManagerService.goToUserData();
        }

        public onChangePassword(): void {
        	console.log(this.form.value);
        }

        public onDisabledClick(): void {
        	this.form.touch();
                this.form.shakingFirstInvalidField();
        }
}
