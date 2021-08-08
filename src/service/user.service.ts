import { UploadChangePasswordAction,
    UploadChangeUserDataAction,
    UploadedChangePasswordAction,
    UploadedChangeUserDataAction,
    UploadErrorChangePasswordAction,
    UploadErrorChangeUserDataAction } from "../store/actions/user.actions";
import { Store } from "../store/store";
import { HTTPClientFacade } from "./api/http-client.facade";
import { changePasswordData, changeUserData } from "./api/modules/user-http-client-module";

let instance: UserService;

export class UserService {
    private readonly httpClientFacade: HTTPClientFacade;
    private readonly store: Store;

    constructor() {
        if (instance) return instance;

        instance = this;

        this.httpClientFacade = new HTTPClientFacade();
        this.store = new Store();
    }

    public changeUserData(data: changeUserData): Promise<void> {
        this.store.dispatch(new UploadChangeUserDataAction());

        return this.httpClientFacade.user.changeData(data)
            .then(response => this.store.dispatch(new UploadedChangeUserDataAction(response.body)))
            .catch(error => {
                this.store.dispatch(new UploadErrorChangeUserDataAction(error))

                throw error;
            });
    }

    public changePassword(data: changePasswordData): Promise<void> {
        this.store.dispatch(new UploadChangePasswordAction());

        return this.httpClientFacade.user.changePassword(data)
            .then(() => this.store.dispatch(new UploadedChangePasswordAction()))
            .catch(error => {
                this.store.dispatch(new UploadErrorChangePasswordAction(error))

                throw error;
            });
    }
}