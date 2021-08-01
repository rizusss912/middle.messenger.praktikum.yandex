import { getDefaultData } from "../functions/get-default-data";
import { State } from "../interfaces/state.interface";
import { userData } from "../interfaces/authorization-state.interface";

export const defaultState: State = {
    authorization: {
        isAuthorized: false,
        userData: getDefaultData<userData>(),
    }
}