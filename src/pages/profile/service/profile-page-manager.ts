import {changePasswordData} from '../../../service/api/modules/user-http-client-module';
import {AuthService} from '../../../service/auth.service';
import {pages} from '../../../service/router/pages.config';
import {RouterService} from '../../../service/router/router.service';
import {UserService} from '../../../service/user.service';
import {userData} from '../../../store/interfaces/authorization-state.interface';
import {selectUserData} from '../../../store/selectors/authorization/select-user-data';
import {selectDataValue} from '../../../store/selectors/data/select-data-value';
import {Store} from '../../../store/store';
import {Observable} from '../../../utils/observeble/observeble';
import {profilePageFormType} from '../enums/profile-page-form-type.enum';

// @ts-ignore
import defaultUserAvatarUrl from '../../../resources/img/default_avatar.png';

export const DEFAULT_USER_AVATAR_URL = defaultUserAvatarUrl;

export enum profilePageContent {
	userData,
	formUserData,
	formPassword,
}

type profilePageQueryParams = {
    form?: profilePageFormType,
}

let instance: ProfilePageManager;

export class ProfilePageManager {
	private readonly routerService: RouterService<profilePageQueryParams>;
	private readonly authService: AuthService;
	private readonly userService: UserService;
	private readonly store: Store;

	constructor() {
		if (instance) {
			return instance;
		}

		instance = this;

		this.authService = new AuthService();
		this.userService = new UserService();
		this.routerService = new RouterService();
		this.store = new Store();
	}

	public get $userData(): Observable<userData> {
		return this.store.$state
			.select(selectUserData)
			.select(selectDataValue)
			.filter(userData => Boolean(userData)) as Observable<userData>;
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
		this.userService.changeUserData(changeUserData);
	}

	public changePassword(passwordsData: changePasswordData): void {
		this.userService.changePassword(passwordsData);
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
