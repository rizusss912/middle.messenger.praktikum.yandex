import {RouterService} from '../../service/router/router.service';
import {pages} from '../../service/router/pages.config';

import {template} from './page-auth.tmpl';

import {Observable} from '../../utils/observeble/observeble';
import {FormGroup} from '../../utils/form/form-group';
import {FormStatusType} from '../../utils/form/form-control';
import {component, CustomHTMLElement} from '../../utils/component';

import {formValidators} from '../../const/form-validators';

import '../../components/input/app-input';
import '../../components/form/app-form';
import '../../components/button/app-button';

import './page-auth.less';

enum authPageType {
    registration = 'registration',
}

type authPageQueryParams = {
    type?: authPageType,
}

const FORM_TITLE = {
	registration: 'Регистрация',
	authorization: 'Вход',
};

@component<PageAuth>({
	name: 'page-auth',
	template,
})
export class PageAuth implements CustomHTMLElement {
    public readonly authForm = new FormGroup({
    	controls: {
        	password: {validators: formValidators.password},
        	login: {validators: formValidators.login},
    	},
    });

    public readonly registrationForm = new FormGroup({
    	controls: {
        	first_name: {validators: formValidators.first_name},
        	second_name: {validators: formValidators.second_name},
    		login: {validators: formValidators.login},
    		email: {validators: formValidators.email},
        	password: {validators: formValidators.password},
        	phone: {validators: formValidators.phone},
    	},
    });

    private readonly routerService: RouterService<authPageQueryParams>;

    constructor() {
    	this.routerService = new RouterService();
    }

    public onInit(): void {}

    public get $title(): Observable<string> {
    	return this.$isRegistration.map(
    		isRegistration => isRegistration ? FORM_TITLE.registration : FORM_TITLE.authorization,
    	);
    }

    public get $isRegistration(): Observable<boolean> {
    	return this.routerService.$queryParams.map(query =>
    		query.type === authPageType.registration,
    	);
    }

    public get $isAuthorization(): Observable<boolean> {
    	return this.$isRegistration.map(isAuthorization => !isAuthorization);
    }

    public get $isInvalidForm(): Observable<boolean> {
    	return Observable.all([
        	this.$isRegistration,
        	this.authForm.$statusChanged.map(status => status.status === FormStatusType.valid),
    		this.registrationForm.$statusChanged.map(
    			status => status.status === FormStatusType.valid),
    	])
        	.map(([isRegistration, isAuthFormValid, isRegistrationFormValid]) =>
        		isRegistration ? !isRegistrationFormValid : !isAuthFormValid,
    		);
    }

    public navigateTo(): void {
    	this.$isAuthorization
        	.only(1)
        	.subscribe(isAuthorization => {
        		if (isAuthorization) {
        			this.routerService.navigateTo(pages.auth, {type: authPageType.registration});
        		} else {
        			this.routerService.navigateTo(pages.auth);
        		}
    		});
    }

    public onAuthorization(): void {
    	this.$isAuthorization
    		.only(1)
        	.subscribe(isAuthorization => {
        		if (isAuthorization) {
        			// TODO: собираем с формочки данные авторизации и идём на сервер
        			console.log(this.authForm.value);
        		} else {
        			// TODO: собираем с формочки данные регистрации и идём на сервер
        			console.log(this.registrationForm.value);
    			}
    		});
    }

    public onDisabledClick(): void {
    	this.$isAuthorization
        	.only(1)
        	.subscribe(isAuthorization => {
        		if (isAuthorization) {
        			this.authForm.touch();
        		} else {
        			this.registrationForm.touch();
        		}
    		});
    }
}
