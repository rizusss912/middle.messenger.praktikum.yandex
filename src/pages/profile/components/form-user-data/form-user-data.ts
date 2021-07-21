import {Component, CustomHTMLElement} from '../../../../utils/component';

import {template} from './form-user-data.tmpl';

import {RouterService} from '../../../../service/router/router.service';
import {pages} from '../../../../service/router/pages.config';

import '../../../../components/form/app-form';
import '../../../../components/input/app-input';
import '../../../../components/button/app-button';

import './form-user-data.less';
import { FormGroup } from '../../../../utils/form/form-group';
import { Observable } from '../../../../utils/observeble/observeble';
import { formValidators } from '../../../../const/form-validators';

@Component<FormUserData>({
    name: 'form-user-data',
    template, 
})
export class FormUserData implements CustomHTMLElement {
        public readonly form = new FormGroup({
            controls: {
                email: {validators: formValidators.email},
                login: {validators: formValidators.login},
                first_name: {validators: formValidators.first_name},
                second_name: {validators: formValidators.second_name},
                display_name: {validators: formValidators.display_name},
                phone: {validators: formValidators.phone},
            }
        });

        private readonly routerService: RouterService<{}>;

        constructor() {
            this.routerService = new RouterService();
        }

        public get $isInvalidForm(): Observable<boolean> {
            return this.form.$isValid.map(isValid => !isValid);
        }

        public onInit(): void {}

        public onBack(): void {
            this.routerService.navigateTo(pages.profile);
        }

        public onChangeData(): void {
            console.log(this.form.value);
        }

        public onDisabledClick(): void {
            this.form.touch();
        }
    }
