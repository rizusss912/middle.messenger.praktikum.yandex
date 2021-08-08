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
        return this.httpClientFacade.user.changeData(data).catch().then();
    }

    public changePassword(data: changePasswordData): Promise<void> {
        return this.httpClientFacade.user.changePassword(data).catch().then();
    }
}