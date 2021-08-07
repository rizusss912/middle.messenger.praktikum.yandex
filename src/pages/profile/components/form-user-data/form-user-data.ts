import {component} from '../../../../utils/component';

import {template} from './form-user-data.tmpl';

import '../../../../components/form/app-form';
import '../../../../components/input/app-input';
import '../../../../components/button/app-button';

import './form-user-data.less';
import {FormGroup} from '../../../../utils/form/form-group';
import {Observable} from '../../../../utils/observeble/observeble';
import {formValidators} from '../../../../const/form-validators';
import {ProfileContent} from '../../elements/profile-content';
import { ProfilePageManager } from '../../service/profile-page-manager';
import { Subscription } from '../../../../utils/observeble/subscription';
import { userData } from '../../../../store/interfaces/authorization-state.interface';

// @ts-ignore
@component({
	name: 'form-user-data',
	template,
})
export class FormUserData extends ProfileContent {
    public readonly form = new FormGroup({
    	controls: {
        	email: {validators: formValidators.email},
        	login: {validators: formValidators.login},
    		first_name: {validators: formValidators.first_name},
    		second_name: {validators: formValidators.second_name},
        	display_name: {validators: formValidators.display_name},
        	phone: {validators: formValidators.phone},
    	},
    });

	private readonly profilePageManager: ProfilePageManager;

	private userDataSubscription: Subscription<userData>;

	constructor() {
		super();

    	this.profilePageManager = new ProfilePageManager();
	}

	public onInit(): void {
		this.userDataSubscription = this.profilePageManager.$userData
			.subscribe(userData => this.form.next(userData));
	}

	public onDestroy(): void {
		this.userDataSubscription.unsubscribe();
	}

	public get $isInvalidForm(): Observable<boolean> {
    	return this.form.$isValid.map(isValid => !isValid);
	}

	static get observedAttributes(): string[] {
		return super.observedAttributes;
	}

	public onBack(): void {
    	this.profilePageManager.goToUserData();
	}

	public onChangeData(): void {
    	this.profilePageManager.changeData(this.form.value as userData);
	}

	public onDisabledClick(): void {
    	this.form.touch();
		this.form.shakingFirstInvalidField();
	}
}
