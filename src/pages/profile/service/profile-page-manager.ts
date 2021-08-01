import {pages} from '../../../service/router/pages.config';
import {RouterService} from '../../../service/router/router.service';
import { UploadedUserDataAction } from '../../../store/actions/authorization.actions';
import { userData } from '../../../store/interfaces/authorization-state.interface';
import { selectDataValue } from '../../../store/selectors/select-data';
import { selectUserData } from '../../../store/selectors/select-user-data';
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
	private readonly store: Store;

	constructor() {
		if (instance) {
			return instance;
		}

		instance = this;

		this.routerService = new RouterService();
		this.store = new Store();

		this.store.dispatch(new UploadedUserDataAction(this.userData));
	}

	public get $userData(): Observable<userData | undefined> {
		return this.store.$state
			.select(selectUserData)
			.select(selectDataValue);
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

	public get userData(): userData {
		return {
			first_name: 'Вадим',
			second_name: 'Кошечкин',
			display_name: 'Вадим',
			avatarUrl: 'https://sun1-87.userapi.com/s/v1/if1/75kO7SiwUAoiofoYlkEX407eGBwbwRzlxVgqp-j8n_5kJZsBMSTOpA1BrMezYnl6lhaecWsP.jpg?size=400x0&quality=96&crop=6,335,1299,1299&ava=1',
			email: 'Rizus912@yandex.ru',
			login: 'rizus',
			phone: '88005553535',
		};
	}
}
