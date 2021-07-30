import {component} from '../../../../utils/component';
import {ProfileManagerService, userData} from '../../service/profile-manager.service';

import {template} from './user-data.tmpl';

import './user-data.less';
import {ProfileContent} from '../../elements/profile-content';

// @ts-ignore
@component({
	name: 'user-data',
	template,
})
export class UserData extends ProfileContent {
        public userData: userData;

        private readonly profileManagerService: ProfileManagerService;

        constructor() {
        	super();

        	this.profileManagerService = new ProfileManagerService();
        }

        static get observedAttributes(): string[] {
        	return super.observedAttributes;
        }

        public onInit(): void {
        	this.userData = this.profileManagerService.userData;
        }

        // TODO: Вынести в manager
        public onChangeData(): void {
        	this.profileManagerService.goToFormData();
        }

        public onChangePassword(): void {
        	this.profileManagerService.goToFormPassword();
        }

        public onExit(): void {
        	this.profileManagerService.goToChats();
        }
}
