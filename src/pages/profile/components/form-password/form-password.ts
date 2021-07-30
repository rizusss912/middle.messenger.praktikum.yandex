import {RouterService} from '../../../../service/router/router.service';
import {pages} from '../../../../service/router/pages.config';

import {FormGroup} from '../../../../utils/form/form-group';
import {Observable} from '../../../../utils/observeble/observeble';
import {component} from '../../../../utils/component';

import {formValidators} from '../../../../const/form-validators';

import {template} from './form-password.tmpl';

import './form-password.less';
import {ProfileContent} from '../../elements/profile-content';

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
        });

        private readonly routerService: RouterService<{}>;

        constructor() {
                super();

        	this.routerService = new RouterService();
        }

        static get observedAttributes(): string[] {
                return super.observedAttributes;
        }

        public get $isInvalidForm(): Observable<boolean> {
        	return this.form.$isValid.map(isValid => !isValid);
        }

        public onInit(): void {}

        public onBack(): void {
        	this.routerService.navigateTo(pages.profile);
        }

        public onChangePassword(): void {
        	console.log(this.form.value);
        }

        public onDisabledClick(): void {
        	this.form.touch();
        }
}
