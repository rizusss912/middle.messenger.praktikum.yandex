import {component, CustomHTMLElement} from '../../utils/component';

import {template} from './page-profile.tmpl';

import '../../components/button/app-button';

import './components/user-data/user-data';
import './components/form-user-data/form-user-data';
import './components/form-password/form-password';

import './page-profile.less';
import {Observable} from '../../utils/observeble/observeble';
import {DEFAULT_USER_AVATAR_URL, profilePageContent, ProfilePageManager} from './service/profile-page-manager';
import {AuthGuard} from '../../guards/auth-guard';
import {userData} from '../../store/interfaces/authorization-state.interface';

export enum hiddenWithAnimtionValue {
    true = 'true',
    false = 'false',
}

@component({
	name: 'page-profile',
	template,
	guards: [AuthGuard],
})
export class PageProfile implements CustomHTMLElement {
    private readonly profilePageManager: ProfilePageManager;

    constructor() {
    	this.profilePageManager = new ProfilePageManager();
    }

    public onInit(): void {
    	this.profilePageManager.uploadUserData();
    }

    public get $userData(): Observable<userData> {
    	return this.profilePageManager.$userData;
    }

    public get $avatar(): Observable<string> {
    	return this.$userData.map(userData => userData.avatarUrl || DEFAULT_USER_AVATAR_URL);
    }

    // Костыльно, но мы ограничены возможностями шаблонзатора
    public get $hideDataList(): Observable<hiddenWithAnimtionValue> {
    	return this.$getIsHideContent(profilePageContent.userData);
    }

    public get $hideFormPassword(): Observable<hiddenWithAnimtionValue> {
    	return this.$getIsHideContent(profilePageContent.formPassword);
    }

    public get $hideFormUserData(): Observable<hiddenWithAnimtionValue> {
    	return this.$getIsHideContent(profilePageContent.formUserData);
    }

    private $getIsHideContent(content: profilePageContent): Observable<hiddenWithAnimtionValue> {
    	return this.profilePageManager.$profilePageContent
    		.map(pageContent =>
    			pageContent === content
    				? hiddenWithAnimtionValue.false
    				: hiddenWithAnimtionValue.true,
    		);
    }
}
