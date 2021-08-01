import { State } from "../interfaces/state.interface"
import { UserDataState } from "../interfaces/user-data-state.interface";

export function selectUserData(state: State): UserDataState {
    return state.userData;
}