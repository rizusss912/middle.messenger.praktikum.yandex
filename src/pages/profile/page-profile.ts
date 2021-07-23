import {Component, CustomHTMLElement} from '../../utils/component';
import {RouterService} from '../../service/router/router.service';
import {ProfileManagerService, userData} from './service/profile-manager.service';

import {template} from './page-profile.tmpl';

import '../../components/button/app-button';

import './components/user-data/user-data';
import './components/form-user-data/form-user-data';
import './components/form-password/form-password';

import './page-profile.less';
import { Observable } from '../../utils/observeble/observeble';

enum profilePageType {
    changePassword = 'changePassword',
    changeData = 'changeData',
};

type profilePageQueryParams = {
    type?: profilePageType,
}

@Component<PageProfile>({
    name: 'page-profile',
    template, 
})
export class PageProfile implements CustomHTMLElement {
        routerService: RouterService<profilePageQueryParams>;
        userData: userData;
        profileManagerService;

        constructor() {
            this.routerService = new RouterService();
            this.profileManagerService = new ProfileManagerService();

            this.userData = this.profileManagerService.userData;
        }

        onInit() {
        }

        get $isNotDataList(): Observable<boolean> {
            return Observable.concat<boolean>([this.$isNotFormPassword, this.$isNotFormUserData])
                .map(([isNotFormPassword, isNotFormUserData]) => !isNotFormPassword || !isNotFormUserData);
        }

        get $isNotFormPassword(): Observable<boolean> {
            return this.routerService.$queryParams.map(query => query.type !== profilePageType.changePassword);
        }

        get $isNotFormUserData(): Observable<boolean> {
            return this.routerService.$queryParams.map(query => query.type !== profilePageType.changeData);
        }
    }