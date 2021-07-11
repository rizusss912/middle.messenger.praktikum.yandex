import {Component, CustomHTMLElement} from '../../utils/component';
import {RouterService} from '../../service/router/router.service';
import {ProfileManagerService, userData} from './service/profile-manager.service';

import {template} from './page-profile.tmpl';

import '../../components/button/app-button';

import './components/user-data/user-data';
import './components/form-user-data/form-user-data';
import './components/form-password/form-password';

import './page-profile.less';

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
        // чтобы убрать это нужно научить шаблонизатор считать логические выражения
        // или сделать свой <doom-id> и <dom-switch>
        get isNotDataList() {
            return !this.isNotFormPassword || !this.isNotFormUserData;
        }

        get isNotFormPassword() {
            return this.routerService.urlParams.queryParams.type !== profilePageType.changePassword;
        }

        get isNotFormUserData() {
            return this.routerService.urlParams.queryParams.type !== profilePageType.changeData;
        }
    }