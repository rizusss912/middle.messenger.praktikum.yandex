import {component, CustomHTMLElement} from '../../../../utils/component';

import {ProfileManagerService, userData} from '../../service/profile-manager.service';
import {RouterService} from '../../../../service/router/router.service';
import {pages} from '../../../../service/router/pages.config';

import {template} from './user-data.tmpl';

import './user-data.less';

@component<UserData>({
	name: 'user-data',
	template,
})
export class UserData implements CustomHTMLElement {
        public userData: userData;

        private readonly profileManagerService: ProfileManagerService;
        private readonly routerService: RouterService<{}>;

        constructor() {
        	this.profileManagerService = new ProfileManagerService();
        	this.routerService = new RouterService();
        }

        public onInit(): void {
        	this.userData = this.profileManagerService.userData;
        }

        public onChangeData(): void {
        	this.routerService.navigateTo(pages.profile, {type: 'changeData'});
        }

        public onChangePassword(): void {
        	this.routerService.navigateTo(pages.profile, {type: 'changePassword'});
        }

        public onExit(): void {
        	this.routerService.navigateTo(pages.chats);
        }
}
