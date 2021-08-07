import { pages } from "../service/router/pages.config";
import { RouterService } from "../service/router/router.service";
import { selectIsAuthorized } from "../store/selectors/authorization/select-is-authorized";
import { Store } from "../store/store";
import { Guard } from "../utils/interfaces/guard";

export class AuthGuard implements Guard {
    private readonly routerService: RouterService<{}>;
    private readonly store: Store;

    constructor() {
        this.store = new Store();
        this.routerService = new RouterService();
    }

    public canOpen(): boolean {
        return selectIsAuthorized(this.store.state);
    }

    public onOpenError(): void {
        this.routerService.navigateTo(pages.auth);
    }
}