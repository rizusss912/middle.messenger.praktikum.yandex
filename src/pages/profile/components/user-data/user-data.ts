import {Component, CustomHTMLElement} from '../../../../utils/component';

import {ProfileManagerService, userData} from '../../service/profile-manager.service';
import {RouterService} from '../../../../service/router/router.service';
import {pages} from '../../../../service/router/pages.config';

import {template} from './user-data.tmpl';

import './user-data.less';

@Component<UserData>({
    name: 'user-data',
    template, 
})
export class UserData implements CustomHTMLElement {
        userData: userData;
        profileManagerService: ProfileManagerService;
        routerService: RouterService<{}>;

        constructor() {
            this.profileManagerService = new ProfileManagerService();
            this.routerService = new RouterService();
        }

        onInit(): void {
            this.userData = this.profileManagerService.userData;
        }

        onChangeData(): void {
            this.routerService.navigateTo(pages.profile, {type: 'changeData'});
        }

        onChangePassword(): void {
            this.routerService.navigateTo(pages.profile, {type: 'changePassword'});
        }

        onExit(): void {
            this.routerService.navigateTo(pages.chats);
        }
    }
