import {template} from './page-auth.tmpl';

import {Observable} from '../../utils/observeble/observeble';
import {FormGroup} from '../../utils/form/form-group';
import {component, CustomHTMLElement} from '../../utils/component';

import {formValidators} from '../../const/form-validators';

import '../../components/input/app-input';
import '../../components/form/app-form';
import '../../components/button/app-button';

import './page-auth.less';
import {Subscription} from '../../utils/observeble/subscription';
import {AuthPageManager} from './services/auth-page-manager';
import {authorizationData, registrationData} from '../../service/api/modules/auth-http-client-module';
import {authPageFormTitle} from './enums/form-title.enum';

@component({
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

    private readonly authPageManager: AuthPageManager;

	private authorizationSubscription: Subscription<authorizationData>;
	private registrationSubscription: Subscription<registrationData>;

	constructor() {
		this.authPageManager = new AuthPageManager();
	}

	public onInit(): void {
		this.authorizationSubscription = this.authForm.$submit
			.subscribe(formData => this.onAuthorization(formData as authorizationData));
		this.registrationSubscription = this.registrationForm.$submit
			.subscribe(formData => this.onRegistration(formData as registrationData));
	}

	public onDestroy(): void {
		if (this.authorizationSubscription) {
			this.authorizationSubscription.unsubscribe();
		}

		if (this.registrationSubscription) {
			this.registrationSubscription.unsubscribe();
		}
	}

	public get $title(): Observable<string> {
    	return this.$isRegistration.map(
    		isRegistration => isRegistration
				? authPageFormTitle.registration
				: authPageFormTitle.authorization,
    	);
	}

	public get $isRegistration(): Observable<boolean> {
		return this.authPageManager.$isRegistration;
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

	public navigateToAuthorization(): void {
		this.authPageManager.navigateToAuthorization();
	}

	public navigateToRegistration(): void {
		this.authPageManager.navigateToRegistration();
	}

	private onAuthorization(authData: authorizationData): void {
		this.authPageManager.authorization(authData);
	}

	private onRegistration(registrationData: registrationData): void {
		this.authPageManager.registration(registrationData);
	}
}
