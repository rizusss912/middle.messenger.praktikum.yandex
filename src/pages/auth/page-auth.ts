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
        	login: {validators: formValidators.login},
			password: {validators: formValidators.password},
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

    public onInit(): void {
		this.authForm.$submit.subscribe(v => console.log('автризация:', v));
		this.registrationForm.$submit.subscribe(v => console.log('регистрация:', v));
	}

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

	public get $isDisabledAuthorizationForm(): Observable<boolean> {
		return this.authForm.$isValid.map(isValid => !isValid);
	}

	public get $isDisabledRegistrationForm(): Observable<boolean> {
		return this.registrationForm.$isValid.map(isValid => !isValid);
	}

	public onDisabledClickFormAuthorization(): void {
		this.authForm.touch();
		this.authForm.shakingFirstInvalidField();
	}

	public onDisabledClickFormRegistration(): void {
		this.registrationForm.touch();
		this.registrationForm.shakingFirstInvalidField();
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
}
