import { AuthorizationState } from "./authorization-state.interface";
import { UserState } from "./user-state.interface";

export interface State {
    authorization: AuthorizationState;
    user: UserState;
}