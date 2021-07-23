import {CustomElement} from '../../utils/custom-element.js';
import RouterService from '../../service/router/router.service.js';
import ProfileManager from './service/profile-manager.service.js';

import {template} from './page-profile.tmpl.js';

import '../../components/button/app-button.js';

import './components/user-data/user-data.js';
import './components/form-user-data/form-user-data.js';
import './components/form-password/form-password.js';

import './page-profile.less';

export default CustomElement({
    name: 'page-profile',
    template, 
})(
    class PageProfile extends HTMLElement {
        router;
        userData;

        constructor() {
            super();

            this.router = new RouterService();
            this.profileManager = new ProfileManager();

            this.userData = this.profileManager.userData;
        }

        connectedCallback() {
            this.render();
        }

        // чтобы убрать это нужно научить шаблонизатор считать логические выражения
        // или сделать свой <doom-id> и <dom-switch>
        get isNotDataList() {
            return !this.isNotFormPassword || !this.isNotFormUserData;
        }

        get isNotFormPassword() {
            return this.router.urlParams.queryParams.type !== 'changePassword';
        }

        get isNotFormUserData() {
            return this.router.urlParams.queryParams.type !== 'changeData';
        }
    }
)