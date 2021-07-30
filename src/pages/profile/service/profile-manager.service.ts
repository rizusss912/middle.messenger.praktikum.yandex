import {pages} from '../../../service/router/pages.config';
import {RouterService} from '../../../service/router/router.service';
import {Observable} from '../../../utils/observeble/observeble';

export interface userData {
    first_name: string;
    second_name: string;
    display_name: string;
    avatarUrl: string;
    email: string;
    login: string;
    phone: string;
}

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

let instance: ProfileManagerService;

export class ProfileManagerService {
	private readonly routerService: RouterService<profilePageQueryParams>;

	constructor() {
		if (instance) {
			return instance;
		}

		instance = this;

		this.routerService = new RouterService();
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
