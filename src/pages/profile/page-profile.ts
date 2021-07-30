import {component, CustomHTMLElement} from '../../utils/component';
import {RouterService} from '../../service/router/router.service';
import {ProfileManagerService, userData} from './service/profile-manager.service';

import {template} from './page-profile.tmpl';

import '../../components/button/app-button';

import './components/user-data/user-data';
import './components/form-user-data/form-user-data';
import './components/form-password/form-password';

import './page-profile.less';
import {Observable} from '../../utils/observeble/observeble';
import { Subject } from '../../utils/observeble/subject';

enum profilePageType {
    changePassword = 'changePassword',
    changeData = 'changeData',
}

type profilePageQueryParams = {
    type?: profilePageType,
}

@component({
	name: 'page-profile',
	template,
})
export class PageProfile implements CustomHTMLElement {
    public routerService: RouterService<profilePageQueryParams>;
    public userData: userData;
    public profileManagerService: ProfileManagerService;

    constructor() {
    	this.routerService = new RouterService();
    	this.profileManagerService = new ProfileManagerService();

    	this.userData = this.profileManagerService.userData;
    }

    public onInit(): void {}

    // костыльно, но мы ограничены возможностями шаблонзатора
    public get $hideDataList(): Observable<string> {
    	return Observable.concat<string>([this.$hideFormPassword, this.$hideFormUserData])
        	.map(([isNotFormPassword, isNotFormUserData]) =>
    			isNotFormPassword !== 'true' || isNotFormUserData !== 'true',
    		)
            .map(value => String(value))
            .uniqueNext();
    }

    public get $hideFormPassword(): Observable<string> {
    	return this.routerService.$queryParams.map(
    		query => query.type !== profilePageType.changePassword)
                .map(value => String(value))
                .uniqueNext();
    }

    public get $hideFormUserData(): Observable<string> {
    	return this.routerService.$queryParams.map(
    		query => query.type !== profilePageType.changeData)
                .map(value => String(value))
                .uniqueNext();
    }
}
