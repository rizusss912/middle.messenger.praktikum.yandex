import {component} from '../../../../utils/component';

import {template} from './user-data.tmpl';

import './user-data.less';
import {ProfileContent} from '../../elements/profile-content';
import { userData } from '../../../../store/interfaces/authorization-state.interface';
import { ProfilePageManager } from '../../service/profile-page-manager';

// @ts-ignore
@component({
	name: 'user-data',
	template,
})
export class UserData extends ProfileContent {
        public userData: userData;

        private readonly profilePageManager: ProfilePageManager;

        constructor() {
        	super();

        	this.profilePageManager = new ProfilePageManager();
        }

        static get observedAttributes(): string[] {
        	return super.observedAttributes;
        }

        public onInit(): void {
        	this.userData = this.profilePageManager.userData;
        }

        public onChangeData(): void {
        	this.profilePageManager.goToFormData();
        }

        public onChangePassword(): void {
        	this.profilePageManager.goToFormPassword();
        }

        public onExit(): void {
        	this.profilePageManager.goToChats();
        }
}
