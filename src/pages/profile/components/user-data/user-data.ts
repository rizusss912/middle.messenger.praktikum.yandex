import {component, CustomHTMLElement} from '../../../../utils/component';

import {ProfileManagerService, userData} from '../../service/profile-manager.service';
import {RouterService} from '../../../../service/router/router.service';
import {pages} from '../../../../service/router/pages.config';

import {template} from './user-data.tmpl';

import './user-data.less';
import { ProfileContent } from '../../elements/profile-content';

//@ts-ignore
@component({
	name: 'user-data',
	template,
})
export class UserData extends ProfileContent {
        public userData: userData;

        private readonly profileManagerService: ProfileManagerService;
        private readonly routerService: RouterService<{}>;

        constructor() {
                super();

        	this.profileManagerService = new ProfileManagerService();
        	this.routerService = new RouterService();
        }

        static get observedAttributes(): string[] {
                return super.observedAttributes;
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
