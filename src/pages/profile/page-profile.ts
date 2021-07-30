import {component, CustomHTMLElement} from '../../utils/component';
import {ProfileManagerService, profilePageContent, userData} from './service/profile-manager.service';

import {template} from './page-profile.tmpl';

import '../../components/button/app-button';

import './components/user-data/user-data';
import './components/form-user-data/form-user-data';
import './components/form-password/form-password';

import './page-profile.less';
import {Observable} from '../../utils/observeble/observeble';

export enum hiddenWithAnimtionValue {
    true = 'true',
    false = 'false',
}

@component({
	name: 'page-profile',
	template,
})
export class PageProfile implements CustomHTMLElement {
    public userData: userData;
    public profileManagerService: ProfileManagerService;

    constructor() {
    	this.profileManagerService = new ProfileManagerService();

    	this.userData = this.profileManagerService.userData;
    }

    public onInit(): void {}

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
    	return this.profileManagerService.$profilePageContent
    		.map(pageContent =>
    			pageContent === content
    				? hiddenWithAnimtionValue.false
    				: hiddenWithAnimtionValue.true,
    		);
    }
}
