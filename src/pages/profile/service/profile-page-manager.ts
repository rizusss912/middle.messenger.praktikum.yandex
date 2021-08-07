import { AuthService } from '../../../service/auth.service';
import {pages} from '../../../service/router/pages.config';
import {RouterService} from '../../../service/router/router.service';
import { userData } from '../../../store/interfaces/authorization-state.interface';
import { selectUserData } from '../../../store/selectors/authorization/select-user-data';
import { selectDataValue } from '../../../store/selectors/data/select-data-value';
import { Store } from '../../../store/store';
import {Observable} from '../../../utils/observeble/observeble';

export enum profilePageContent {
	userData,
	formUserData,
	formPassword,
}

enum profilePageFormType {
    changeData = 'changeData',
	changePassword = 'changePassword',
}

type profilePageQueryParams = {
    form?: profilePageFormType,
}

let instance: ProfilePageManager;

export class ProfilePageManager {
	private readonly routerService: RouterService<profilePageQueryParams>;
	private readonly authService: AuthService;
	private readonly store: Store;

	constructor() {
		if (instance) {
			return instance;
		}

		instance = this;

		this.authService = new AuthService();
		this.routerService = new RouterService();
		this.store = new Store();
	}

	public get $userData(): Observable<userData> {
		return this.store.$state
			.select(selectUserData)
			.select(selectDataValue)
			.filter(userData => !!userData) as Observable<userData>;
	}

	public get $profilePageContent(): Observable<profilePageContent> {
		return this.routerService.$queryParams
			.map(query => {
				switch (query.form) {
					case profilePageFormType.changeData:
						return profilePageContent.formUserData;
					case profilePageFormType.changePassword:
						return profilePageContent.formPassword;
					default:
						return profilePageContent.userData;
				}
			})
			.uniqueNext();
	}

	public uploadUserData(): void {
		this.authService.uploadUserDataIfNot();
	}

	public changeData(changeUserData: userData): void {
		console.log(changeUserData);
	}

	public changePassword(changePasswordData: changePasswordData): void {
		console.log(changePasswordData);
	}

	public goToUserData(): void {
		this.routerService.navigateTo(pages.profile);
	}

	public goToFormData(): void {
		this.routerService.navigateTo(pages.profile, {form: profilePageFormType.changeData});
	}

	public goToFormPassword(): void {
		this.routerService.navigateTo(pages.profile, {form: profilePageFormType.changePassword});
	}

	public goToChats(): void {
		this.routerService.navigateTo(pages.chats);
	}
}
