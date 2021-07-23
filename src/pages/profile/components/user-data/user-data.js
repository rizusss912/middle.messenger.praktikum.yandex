import {CustomElement} from '../../../../utils/custom-element.js';

import ProfileManagerService from '../../service/profile-manager.service.js';
import RouterService from '../../../../service/router/router.service.js';
import {pages} from '../../../../service/router/pages.config.js';

import {template} from './user-data.tmpl.js';

import './user-data.less';

export default CustomElement({
    name: 'user-data',
    template, 
})(
    class UserData extends HTMLElement {
        userData;
        profileManagerService;

        constructor() {
            super();

            this.profileManagerService = new ProfileManagerService();
            this.routerService = new RouterService();
        }

        connectedCallback() {
            this.userData = this.profileManagerService.userData;
            this.render();
        }

        static get observedAttributes() {
            return ["hidden"];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === "hidden" && oldValue !== newValue) {
                if (newValue === "true") {
                    this.style.display = "none";
                } else {
                    this.style.display = "block";
                    this.render();
                }
            }
        }

        onChangeData() {
            this.routerService.navigateTo(pages.profile, {type: 'changeData'});
        }

        onChangePassword() {
            this.routerService.navigateTo(pages.profile, {type: 'changePassword'});
        }

        onExit() {
            this.routerService.navigateTo(pages.chats);
        }
    }
)